import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, MfaVerifyDto, ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto, ipAddress: string) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { username: dto.username }] } });
    if (existing) throw new ConflictException('Email or username already registered');

    const birthDate = new Date(dto.dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) throw new BadRequestException('You must be at least 18 years old to register');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const isDemo = this.config.get('DEMO_MODE') !== false;

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: dto.email, username: dto.username, password_hash: passwordHash, phone: dto.phone,
          preferred_currency: dto.currency || 'USD', preferred_language: dto.language || 'en', last_login_ip: ipAddress },
      });
      await tx.userProfile.create({
        data: { user_id: user.id, first_name: dto.firstName, last_name: dto.lastName, date_of_birth: new Date(dto.dateOfBirth),
          country: dto.country, city: dto.city, address_line1: dto.address, postal_code: dto.postalCode },
      });
      await tx.wallet.create({ data: { user_id: user.id, currency: dto.currency || 'USD', balance_available: isDemo ? 10000 : 0 } });
      await tx.notificationPreference.create({ data: { user_id: user.id } });
      return user;
    });

    this.logger.log(`New user registered: ${result.email}`);
    return { message: 'Registration successful. Please verify your email.', userId: result.id };
  }

  async login(dto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.login }, { username: dto.login }] } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.is_active || user.is_suspended) throw new UnauthorizedException('Account is suspended or deactivated');
    if (user.locked_until && user.locked_until > new Date()) throw new UnauthorizedException('Account temporarily locked');

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) { await this.handleFailedLogin(user.id); throw new UnauthorizedException('Invalid credentials'); }

    if (user.mfa_enabled) {
      if (!dto.mfaCode) return { requiresMfa: true, mfaToken: this.jwtService.sign({ userId: user.id }, { expiresIn: '5m' }) };
    }

    const tokens = await this.createSession(user, ipAddress, userAgent);
    await this.resetLoginAttempts(user.id);
    const { password_hash, mfa_secret, mfa_backup_codes, ...sanitized } = user;
    return { ...tokens, user: sanitized };
  }

  async logout(userId: string, sessionId: string) {
    await this.prisma.session.updateMany({ where: { user_id: userId, id: sessionId }, data: { revoked_at: new Date() } });
    return { message: 'Logged out successfully' };
  }

  private async createSession(user: any, ipAddress: string, userAgent: string) {
    const sessionId = uuidv4();
    const accessToken = this.jwtService.sign({ sub: user.id, sessionId });
    const refreshToken = this.jwtService.sign({ sub: user.id, sessionId }, { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') });
    await this.prisma.session.create({ data: { id: sessionId, user_id: user.id, token_hash: accessToken.slice(-32), refresh_token_hash: refreshToken.slice(-32), ip_address: ipAddress, user_agent: userAgent, is_current: true, expires_at: new Date(Date.now() + 7*24*60*60*1000) } });
    return { accessToken, refreshToken, expiresIn: 900, sessionId };
  }

  private async handleFailedLogin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const attempts = (user.login_attempts || 0) + 1;
    await this.prisma.user.update({ where: { id: userId }, data: { login_attempts: attempts, locked_until: attempts >= 5 ? new Date(Date.now() + 30*60*1000) : null } });
  }

  private async resetLoginAttempts(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { login_attempts: 0, locked_until: null } });
  }
}
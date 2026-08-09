import { Controller, Post, Get, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto, MfaVerifyDto, ChangePasswordDto } from './dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async register(@Body() dto: RegisterDto, @Req() req) {
    return this.authService.register(dto, req.ip);
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req) {
    return this.authService.login(dto, req.ip, req.headers['user-agent'] || '');
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMfa(@Body() dto: MfaVerifyDto, @Req() req) {
    return this.authService.verifyMfa(dto, req.ip, req.headers['user-agent'] || '');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req) {
    return this.authService.refreshToken(refreshToken, req.ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req) {
    return this.authService.logout(req.user.id, req.user.sessionId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return { user: req.user };
  }
}
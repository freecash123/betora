import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsDateString, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) @MaxLength(30) username: string;
  @IsString() @MinLength(8) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsDateString() dateOfBirth: string;
  @IsString() country: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsIn(['USD','EUR','GBP','NGN','KES','ZAR']) currency?: string;
  @IsOptional() @IsString() language?: string;
}

export class LoginDto {
  @IsString() login: string;
  @IsString() password: string;
  @IsOptional() @IsString() mfaCode?: string;
}

export class MfaVerifyDto {
  @IsString() mfaToken: string;
  @IsString() code: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString() @MinLength(8) newPassword: string;
}

export class ResetPasswordDto {
  @IsString() token: string;
  @IsString() @MinLength(8) newPassword: string;
}
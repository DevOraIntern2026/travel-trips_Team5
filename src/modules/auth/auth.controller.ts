import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { ForgotPasswordDto } from './dto/forget-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';
import { GoogleLoginDto } from './dto/google-login.dto.js';
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
@Post('login')
@HttpCode(200)
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
@Post('refresh')
@HttpCode(200)
refresh(@Body() refreshTokenDto: RefreshTokenDto) {
  return this.authService.refresh(refreshTokenDto.refreshToken);
}
@Post('logout')
@HttpCode(200)
@UseGuards(JwtAuthGuard)
logout(@Req() request: Request) {
  const user = request.user as AuthenticatedUser;

  return this.authService.logout(user.sub);
}
@Post('change-password')
@HttpCode(200)
@UseGuards(JwtAuthGuard)
changePassword(
  @Req() request: Request,
  @Body() changePasswordDto: ChangePasswordDto,
) {
  const user = request.user as AuthenticatedUser;

  return this.authService.changePassword(
    user.sub,
    changePasswordDto,
  );
}
@Post('forgot-password')
@HttpCode(200)
forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  return this.authService.forgotPassword(forgotPasswordDto.email);
}

@Post('reset-password')
@HttpCode(200)
resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  return this.authService.resetPassword(resetPasswordDto);
}
@Post('verify-email')
@HttpCode(200)
verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  return this.authService.verifyEmail(verifyEmailDto.token);
}

@Post('resend-verification')
@HttpCode(200)
resendVerification(
  @Body() resendVerificationDto: ResendVerificationDto,
) {
  return this.authService.resendVerification(
    resendVerificationDto.email,
  );
}
@Post('google')
googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
  return this.authService.googleLogin(googleLoginDto);
}
}
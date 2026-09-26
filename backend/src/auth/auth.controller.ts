import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import type { AuthenticatedUser } from './authenticated-user.js';
import { AuthService } from './auth.service.js';
import { AuthSessionResponse } from './dto/auth-response.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { GoogleAuthDto } from './dto/google-auth.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';

@ApiTags('auth')
// Stricter than the global 10 req/60s: auth endpoints are the brute-force
// surface. (E2E neutralizes counting via storage override, so suites pass.)
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new Customer account' })
  @ApiResponse({
    status: 201,
    description: 'Account created, session issued.',
    type: AuthSessionResponse,
  })
  @ApiResponse({ status: 409, description: 'Email is already in use.' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('verify-email')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify an email address' })
  @ApiResponse({
    status: 200,
    description: 'Email verified.',
    schema: {
      type: 'object',
      properties: { verified: { type: 'boolean' } },
      example: { verified: true },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto);
  }

  @Post('resend-verification')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend the verification email' })
  @ApiResponse({
    status: 200,
    description: 'Always succeeds (no probing).',
    schema: {
      type: 'object',
      properties: { sent: { type: 'boolean' } },
      example: { sent: true },
    },
  })
  resendVerification(@Body() dto: ForgotPasswordDto) {
    return this.auth.resendVerification(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Session issued.',
    type: AuthSessionResponse,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('google')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate or register with Google' })
  @ApiResponse({
    status: 200,
    description: 'Session issued.',
    type: AuthSessionResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad token or unconfigured.' })
  google(@Body() dto: GoogleAuthDto) {
    return this.auth.google(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate a refresh token into a new session' })
  @ApiResponse({
    status: 200,
    description: 'New session issued.',
    type: AuthSessionResponse,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto);
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke a refresh session' })
  @ApiResponse({
    status: 200,
    description: 'Always succeeds.',
    schema: {
      type: 'object',
      properties: { loggedOut: { type: 'boolean' } },
      example: { loggedOut: true },
    },
  })
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Request a password-reset email' })
  @ApiResponse({
    status: 200,
    description: 'Always succeeds (no probing).',
    schema: {
      type: 'object',
      properties: { sent: { type: 'boolean' } },
      example: { sent: true },
    },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Set a new password with a reset token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset.',
    schema: {
      type: 'object',
      properties: { reset: { type: 'boolean' } },
      example: { reset: true },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }

  @Post('change-password')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change the authenticated password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed.',
    schema: {
      type: 'object',
      properties: { changed: { type: 'boolean' } },
      example: { changed: true },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated / wrong current.' })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(user.id, dto);
  }
}

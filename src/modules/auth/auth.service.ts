import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { ForgotPasswordDto } from './dto/forget-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLoginDto } from './dto/google-login.dto.js';
@Injectable()
export class AuthService {
constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService,
) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
      },
    });

    return {
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    };
  }
async refresh(refreshToken: string) {
  let payload: {
    sub: string;
    type: string;
  };

  try {
    payload = await this.jwtService.verifyAsync(refreshToken);
  } catch {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user || !user.refreshTokenHash) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const isValid = await bcrypt.compare(
    refreshToken,
    user.refreshTokenHash,
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const newAccessToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    {
      expiresIn: '15m',
    },
  );

  const newRefreshToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      type: 'refresh',
    },
    {
      expiresIn: '7d',
    },
  );

  const newRefreshTokenHash = await bcrypt.hash(
    newRefreshToken,
    12,
  );

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash: newRefreshTokenHash,
    },
  });

  return {
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
}
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return {
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }
async logout(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  await this.prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash: null,
    },
  });

  return {
    message: 'Logout successful',
  };
}
async changePassword(
  userId: string,
  changePasswordDto: ChangePasswordDto,
) {
  const { currentPassword, newPassword } = changePasswordDto;

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.passwordHash) {
    throw new UnauthorizedException('User not found');
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  await this.prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newPasswordHash,
      refreshTokenHash: null,
    },
  });

  return {
    message: 'Password changed successfully',
  };
}
async forgotPassword(email: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  const resetToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      type: 'password-reset',
    },
    {
      expiresIn: '15m',
    },
  );

  const resetTokenHash = await bcrypt.hash(resetToken, 12);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: resetTokenHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  return {
    message: 'Password reset token generated',
    data: {
      resetToken,
    },
  };
}
async resetPassword(resetPasswordDto: ResetPasswordDto) {
  const { token, newPassword } = resetPasswordDto;

  let payload: {
    sub: string;
    type: string;
  };

  try {
    payload = await this.jwtService.verifyAsync(token);
  } catch {
    throw new UnauthorizedException('Invalid or expired reset token');
  }

  if (payload.type !== 'password-reset') {
    throw new UnauthorizedException('Invalid reset token');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (
    !user ||
    !user.passwordResetTokenHash ||
    !user.passwordResetExpiresAt
  ) {
    throw new UnauthorizedException('Invalid reset token');
  }

  if (user.passwordResetExpiresAt < new Date()) {
    throw new UnauthorizedException('Reset token expired');
  }

  const isValid = await bcrypt.compare(
    token,
    user.passwordResetTokenHash,
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      refreshTokenHash: null,
    },
  });

  return {
    message: 'Password reset successfully',
  };
}
async verifyEmail(token: string) {
  let payload: {
    sub: string;
    type: string;
  };

  try {
    payload = await this.jwtService.verifyAsync(token);
  } catch {
    throw new UnauthorizedException(
      'Invalid or expired verification token',
    );
  }

  if (payload.type !== 'email-verification') {
    throw new UnauthorizedException(
      'Invalid verification token',
    );
  }

  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (
    !user ||
    !user.emailVerificationTokenHash ||
    !user.emailVerificationExpiresAt
  ) {
    throw new UnauthorizedException(
      'Invalid verification token',
    );
  }

  if (user.emailVerificationExpiresAt < new Date()) {
    throw new UnauthorizedException(
      'Verification token expired',
    );
  }

  const isValid = await bcrypt.compare(
    token,
    user.emailVerificationTokenHash,
  );

  if (!isValid) {
    throw new UnauthorizedException(
      'Invalid verification token',
    );
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
    },
  });

  return {
    message: 'Email verified successfully',
  };
}
async resendVerification(email: string) {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message:
        'If the email exists, a verification email has been sent',
    };
  }

  if (user.emailVerifiedAt) {
    return {
      message: 'Email is already verified',
    };
  }

  const verificationToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      type: 'email-verification',
    },
    {
      expiresIn: '15m',
    },
  );

  const verificationTokenHash = await bcrypt.hash(
    verificationToken,
    12,
  );

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationTokenHash: verificationTokenHash,
      emailVerificationExpiresAt: new Date(
        Date.now() + 15 * 60 * 1000,
      ),
    },
  });

  return {
    message: 'Verification token generated',
    data: {
      verificationToken,
    },
  };
}
async googleLogin(googleLoginDto: GoogleLoginDto) {
  const { idToken } = googleLoginDto;

  const googleClient = new OAuth2Client(
    this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
  );

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
    });

    payload = ticket.getPayload();
  } catch {
    throw new UnauthorizedException('Invalid Google ID token');
  }

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new UnauthorizedException('Invalid Google account');
  }

  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name ?? email.split('@')[0];

  let user = await this.prisma.user.findUnique({
    where: { googleId },
  });

  if (!user) {
    user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          googleId,
          emailVerifiedAt: new Date(),
          passwordHash: null,
        },
      });
    }
  }

  if (user.status !== 'ACTIVE') {
    throw new UnauthorizedException('User account is not active');
  }

  const accessToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    {
      expiresIn: '15m',
    },
  );

  const refreshToken = await this.jwtService.signAsync(
    {
      sub: user.id,
      type: 'refresh',
    },
    {
      expiresIn: '7d',
    },
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  await this.prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  return {
    message: 'Google login successful',
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    },
  };
}
}
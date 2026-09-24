import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { escapeLikePattern } from '../common/like-pattern.js';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import { toUserRole, type AuthenticatedUser } from './authenticated-user.js';
import { GoogleAuthService } from './google-auth.service.js';
import { MAILER_PROVIDER, type Mailer } from './mailer.port.js';
import { PasswordService } from './password.service.js';
import { hashToken, randomToken } from './token-utils.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import type { GoogleAuthDto } from './dto/google-auth.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RefreshDto } from './dto/refresh.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { ResetPasswordDto } from './dto/reset-password.dto.js';
import type { VerifyEmailDto } from './dto/verify-email.dto.js';

type DbUser = Omit<
  Models.public_User,
  'posts' | 'operator' | 'refreshSessions' | 'authTokens'
>;

export interface SafeUser {
  id: number;
  email: string;
  name: string | null;
  role: AuthenticatedUser['role'];
  operatorId: number | null;
  emailVerified: boolean;
  isActive: boolean;
}

export interface AuthSession {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

const VERIFY_EMAIL_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_PASSWORD_TTL_MS = 60 * 60 * 1000;

/** Generic 401: never reveal whether the email exists or is deactivated. */
function invalidCredentials(): UnauthorizedException {
  return new UnauthorizedException('Invalid email or password');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly passwords: PasswordService,
    private readonly googleAuth: GoogleAuthService,
    @Inject(MAILER_PROVIDER) private readonly mailer: Mailer,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const email = dto.email.toLowerCase();
    const taken = await db.orm.public.User.where((u) =>
      u.email.ilike(escapeLikePattern(email)),
    ).first();
    if (taken) {
      throw new ConflictException('Email is already in use');
    }

    const created = await db.orm.public.User.create({
      email,
      passwordHash: await this.passwords.hash(dto.password),
      ...(dto.name?.trim() ? { name: dto.name.trim() } : {}),
    });

    await this.issueAuthToken(created.id, 'verify-email', VERIFY_EMAIL_TTL_MS);
    return this.issueSession(created.id);
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const user = await db.orm.public.User.where((u) =>
      u.email.eq(dto.email.toLowerCase()),
    ).first();
    if (
      !user ||
      !user.isActive ||
      !user.passwordHash ||
      !(await this.passwords.verify(user.passwordHash, dto.password))
    ) {
      throw invalidCredentials();
    }
    return this.issueSession(user.id);
  }

  async google(dto: GoogleAuthDto): Promise<AuthSession> {
    const profile = await this.googleAuth.verify(dto.idToken);
    const existing = await db.orm.public.User.where((u) =>
      u.email.eq(profile.email),
    ).first();
    if (existing) {
      if (!existing.isActive) {
        throw invalidCredentials();
      }
      return this.issueSession(existing.id);
    }
    const created = await db.orm.public.User.create({
      email: profile.email,
      ...(profile.name ? { name: profile.name } : {}),
      emailVerifiedAt: new Date().toISOString(),
    });
    return this.issueSession(created.id);
  }

  async refresh(dto: RefreshDto): Promise<AuthSession> {
    const session = await db.orm.public.RefreshSession.where((s) =>
      s.tokenHash.eq(hashToken(dto.refreshToken)),
    ).first();
    // Numeric comparison: timestamptz reads back as 'YYYY-MM-DD HH:MI:SS+TZ',
    // which does NOT sort lexicographically against ISO strings.
    if (!session || Date.parse(session.expiresAt) <= Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (session.revokedAt !== null) {
      // Reuse of a rotated token: possible theft — revoke the whole chain.
      await this.revokeAllSessions(session.userId);
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await db.orm.public.User.first({ id: session.userId });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await db.orm.public.RefreshSession.where({ id: session.id }).update({
      revokedAt: nowIso(),
    });
    return this.issueSession(user.id);
  }

  async logout(dto: RefreshDto): Promise<{ loggedOut: true }> {
    const session = await db.orm.public.RefreshSession.where((s) =>
      s.tokenHash.eq(hashToken(dto.refreshToken)),
    ).first();
    if (session && session.revokedAt === null) {
      await db.orm.public.RefreshSession.where({ id: session.id }).update({
        revokedAt: nowIso(),
      });
    }
    return { loggedOut: true };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ verified: true }> {
    const token = await this.findLiveToken(dto.token, 'verify-email');
    if (!token) {
      throw new BadRequestException('Invalid or expired verification token');
    }
    await db.orm.public.User.where({ id: token.userId }).update({
      emailVerifiedAt: nowIso(),
    });
    await this.consumeToken(token.id);
    return { verified: true };
  }

  async resendVerification(dto: ForgotPasswordDto): Promise<{ sent: true }> {
    const user = await db.orm.public.User.where((u) =>
      u.email.eq(dto.email.toLowerCase()),
    ).first();
    if (user && user.isActive && user.emailVerifiedAt === null) {
      await this.issueAuthToken(user.id, 'verify-email', VERIFY_EMAIL_TTL_MS);
    }
    // Always succeed: must not reveal whether the email exists.
    return { sent: true };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ sent: true }> {
    const user = await db.orm.public.User.where((u) =>
      u.email.eq(dto.email.toLowerCase()),
    ).first();
    if (user && user.isActive) {
      await this.issueAuthToken(
        user.id,
        'reset-password',
        RESET_PASSWORD_TTL_MS,
      );
    }
    return { sent: true };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ reset: true }> {
    const token = await this.findLiveToken(dto.token, 'reset-password');
    if (!token) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    await db.orm.public.User.where({ id: token.userId }).update({
      passwordHash: await this.passwords.hash(dto.newPassword),
    });
    await this.consumeToken(token.id);
    await this.revokeAllSessions(token.userId);
    return { reset: true };
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ changed: true }> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException();
    }
    if (
      !(await this.passwords.verify(user.passwordHash, dto.currentPassword))
    ) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    await db.orm.public.User.where({ id: userId }).update({
      passwordHash: await this.passwords.hash(dto.newPassword),
    });
    await this.revokeAllSessions(userId);
    return { changed: true };
  }

  /** Load + authorize a JWT subject for guards. Throws 401 when unusable. */
  async validateSessionUser(userId: number): Promise<AuthenticatedUser> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      role: toUserRole(user.role),
      operatorId: user.operatorId,
      emailVerified: user.emailVerifiedAt !== null,
    };
  }

  private async issueSession(userId: number): Promise<AuthSession> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    const refreshToken = randomToken();
    const refreshDays = this.config.get<number>('REFRESH_TTL_DAYS') ?? 30;
    await db.orm.public.RefreshSession.create({
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshDays * 86_400_000).toISOString(),
    });
    const accessTtlSec = this.config.get<number>('JWT_ACCESS_TTL_SEC') ?? 900;
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: toUserRole(user.role),
        operatorId: user.operatorId,
        emailVerified: user.emailVerifiedAt !== null,
      },
      { expiresIn: accessTtlSec },
    );
    return { user: toSafeUser(user), accessToken, refreshToken };
  }

  private async issueAuthToken(
    userId: number,
    purpose: 'verify-email' | 'reset-password',
    ttlMs: number,
  ): Promise<string> {
    const raw = randomToken();
    await db.orm.public.AuthToken.create({
      userId,
      purpose,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    });
    const base = this.config.get<string>('APP_PUBLIC_URL') ?? '';
    const path = purpose === 'verify-email' ? 'verify-email' : 'reset-password';
    const link = `${base}/auth/${path}?token=${raw}`;
    // Email is a best-effort side effect: a mail failure (bad SMTP
    // credentials, provider outage) must never fail the request that
    // triggered it. The token row is already stored, so verification and
    // reset stay possible via resend.
    try {
      if (purpose === 'verify-email') {
        const user = await db.orm.public.User.first({ id: userId });
        await this.mailer.sendVerificationEmail({
          to: user?.email ?? '',
          link,
        });
      } else {
        const user = await db.orm.public.User.first({ id: userId });
        await this.mailer.sendPasswordResetEmail({
          to: user?.email ?? '',
          link,
        });
      }
    } catch (error) {
      this.logger.warn(
        `Outbound ${purpose} email failed for user ${userId}: ${(error as Error)?.message ?? error}`,
      );
    }
    return raw;
  }

  private async findLiveToken(
    token: string,
    purpose: 'verify-email' | 'reset-password',
  ) {
    const row = await db.orm.public.AuthToken.where((t) =>
      t.tokenHash.eq(hashToken(token)),
    )
      .where((t) => t.consumedAt.isNull())
      .first();
    if (
      !row ||
      row.purpose !== purpose ||
      Date.parse(row.expiresAt) <= Date.now()
    ) {
      return null;
    }
    return row;
  }

  private async consumeToken(id: number): Promise<void> {
    await db.orm.public.AuthToken.where({ id }).update({
      consumedAt: nowIso(),
    });
  }

  private async revokeAllSessions(userId: number): Promise<void> {
    const sessions = await db.orm.public.RefreshSession.where((s) =>
      s.userId.eq(userId),
    )
      .where((s) => s.revokedAt.isNull())
      .all();
    for (const session of sessions) {
      await db.orm.public.RefreshSession.where({ id: session.id }).update({
        revokedAt: nowIso(),
      });
    }
  }
}

function toSafeUser(row: DbUser): SafeUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: toUserRole(row.role),
    operatorId: row.operatorId,
    emailVerified: row.emailVerifiedAt !== null,
    isActive: row.isActive,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

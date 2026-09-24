import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

function buildCollection() {
  const stub = {
    where: vi.fn(),
    first: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    all: vi.fn(),
  };
  stub.where.mockReturnValue(stub);
  return stub;
}

const harness = vi.hoisted(() => {
  const users = buildCollection();
  const sessions = buildCollection();
  const tokens = buildCollection();
  // Namespace-level direct calls (.first({}), .create()) need their own
  // mocks: the collection stubs above only serve .where() chains.
  const userNs = { first: vi.fn(), create: vi.fn() };
  const sessionNs = { create: vi.fn() };
  const tokenNs = { create: vi.fn() };
  const db = {
    orm: {
      public: {
        User: {
          where: vi.fn(() => users),
          first: userNs.first,
          create: userNs.create,
        },
        RefreshSession: {
          where: vi.fn(() => sessions),
          first: vi.fn(),
          create: sessionNs.create,
        },
        AuthToken: {
          where: vi.fn(() => tokens),
          first: vi.fn(),
          create: tokenNs.create,
        },
      },
    },
  };
  const jwt = { signAsync: vi.fn(), verifyAsync: vi.fn() };
  const passwords = { hash: vi.fn(), verify: vi.fn() };
  const google = { verify: vi.fn() };
  const mailer = {
    sendVerificationEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  };
  const config = { get: vi.fn(), getOrThrow: vi.fn() };
  return {
    db,
    jwt,
    passwords,
    google,
    mailer,
    config,
    users,
    sessions,
    tokens,
    userNs,
    sessionNs,
    tokenNs,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-24T00:00:00.000Z';
const FUTURE = '2999-01-01T00:00:00.000Z';
const PAST = '2000-01-01T00:00:00.000Z';

function user(overrides = {}) {
  return {
    id: 1,
    email: 'sara@example.com',
    passwordHash: 'hash:S3cure-p@ssphrase',
    username: null,
    name: 'Sara',
    role: 'customer',
    operatorId: null,
    emailVerifiedAt: null,
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

function session(overrides = {}) {
  return {
    id: 1,
    userId: 1,
    tokenHash: 'tokhash',
    expiresAt: FUTURE,
    revokedAt: null,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

function authToken(overrides = {}) {
  return {
    id: 1,
    userId: 1,
    purpose: 'verify-email',
    tokenHash: 'tokhash',
    expiresAt: FUTURE,
    consumedAt: null,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.users.where.mockReturnValue(harness.users);
    harness.sessions.where.mockReturnValue(harness.sessions);
    harness.tokens.where.mockReturnValue(harness.tokens);
    harness.config.get.mockReturnValue(undefined);
    harness.jwt.signAsync.mockResolvedValue('signed-access');
    harness.passwords.hash.mockImplementation(async (p: string) => `hash:${p}`);
    harness.passwords.verify.mockImplementation(
      async (h: string, p: string) => h === `hash:${p}`,
    );
    service = new AuthService(
      harness.jwt as never,
      harness.passwords as never,
      harness.google as never,
      harness.mailer as never,
      harness.config as never,
    );
  });

  describe('register', () => {
    it('creates a Customer with a hashed password and mails a link', async () => {
      harness.users.first.mockResolvedValue(null);
      harness.userNs.create.mockResolvedValue(user());
      harness.tokenNs.create.mockResolvedValue(authToken());
      harness.userNs.first.mockResolvedValue(user());
      harness.sessionNs.create.mockResolvedValue(session());

      const result = await service.register({
        email: 'Sara@Example.com',
        password: 'S3cure-p@ssphrase',
      });

      expect(harness.userNs.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'sara@example.com',
          passwordHash: 'hash:S3cure-p@ssphrase',
        }),
      );
      expect(harness.mailer.sendVerificationEmail).toHaveBeenCalled();
      expect(result.user.role).toBe('Customer');
      expect(result.accessToken).toBe('signed-access');
      expect(result.refreshToken).toBeTruthy();
    });

    it('rejects duplicate emails case-insensitively', async () => {
      harness.users.first.mockResolvedValue(user());

      await expect(
        service.register({
          email: 'SARA@example.com',
          password: 'x'.repeat(9),
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.userNs.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('issues a session for valid credentials', async () => {
      harness.users.first.mockResolvedValue(user());
      harness.userNs.first.mockResolvedValue(user());
      harness.sessionNs.create.mockResolvedValue(session());

      const result = await service.login({
        email: 'sara@example.com',
        password: 'S3cure-p@ssphrase',
      });

      expect(result.user.email).toBe('sara@example.com');
      expect(result.accessToken).toBe('signed-access');
    });

    it('rejects unknown emails, wrong passwords and inactive accounts alike', async () => {
      harness.users.first.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nobody@example.com', password: 'x' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      harness.users.first.mockResolvedValue(user());
      await expect(
        service.login({ email: 'sara@example.com', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      harness.users.first.mockResolvedValue(user({ isActive: false }));
      await expect(
        service.login({
          email: 'sara@example.com',
          password: 'S3cure-p@ssphrase',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      harness.users.first.mockResolvedValue(user({ passwordHash: null }));
      await expect(
        service.login({ email: 'sara@example.com', password: 'x' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('google', () => {
    it('creates verified users on first sight', async () => {
      harness.google.verify.mockResolvedValue({
        email: 'G@EXAMPLE.COM',
        name: 'G',
      });
      harness.users.first.mockResolvedValue(null);
      harness.userNs.create.mockResolvedValue(user({ emailVerifiedAt: STAMP }));
      harness.userNs.first.mockResolvedValue(user({ emailVerifiedAt: STAMP }));
      harness.sessionNs.create.mockResolvedValue(session());

      const result = await service.google({ idToken: 'tok' });

      expect(harness.userNs.create).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerifiedAt: expect.any(String) }),
      );
      expect(result.user.emailVerified).toBe(true);
    });

    it('logs in existing users', async () => {
      harness.google.verify.mockResolvedValue({ email: 'sara@example.com' });
      harness.users.first.mockResolvedValue(user());
      harness.userNs.first.mockResolvedValue(user());
      harness.sessionNs.create.mockResolvedValue(session());

      const result = await service.google({ idToken: 'tok' });

      expect(harness.userNs.create).not.toHaveBeenCalled();
      expect(result.accessToken).toBe('signed-access');
    });

    it('rejects when unconfigured', async () => {
      harness.google.verify.mockRejectedValue(
        new BadRequestException('Google sign-in is not configured'),
      );

      await expect(service.google({ idToken: 'tok' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('refresh', () => {
    it('rotates the session', async () => {
      harness.sessions.first.mockResolvedValue(session());
      harness.userNs.first.mockResolvedValue(user());
      harness.sessionNs.create.mockResolvedValue(session({ id: 2 }));

      const result = await service.refresh({ refreshToken: 'raw' });

      expect(harness.sessions.update).toHaveBeenCalledWith(
        expect.objectContaining({ revokedAt: expect.any(String) }),
      );
      expect(result.refreshToken).toBeTruthy();
    });

    it('rejects unknown, expired and revoked tokens', async () => {
      harness.sessions.first.mockResolvedValue(null);
      await expect(
        service.refresh({ refreshToken: 'nope' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      harness.sessions.first.mockResolvedValue(session({ expiresAt: PAST }));
      await expect(
        service.refresh({ refreshToken: 'old' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('revokes everything on reuse of a rotated token', async () => {
      harness.sessions.first.mockResolvedValue(session({ revokedAt: STAMP }));
      harness.sessions.all.mockResolvedValue([session({ id: 2 })]);

      await expect(
        service.refresh({ refreshToken: 'reused' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(harness.sessions.update).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('revokes the session and tolerates unknown tokens', async () => {
      harness.sessions.first.mockResolvedValue(session());

      await expect(service.logout({ refreshToken: 'raw' })).resolves.toEqual({
        loggedOut: true,
      });
      expect(harness.sessions.update).toHaveBeenCalled();

      harness.sessions.first.mockResolvedValue(null);
      await expect(service.logout({ refreshToken: 'nope' })).resolves.toEqual({
        loggedOut: true,
      });
    });
  });

  describe('verifyEmail', () => {
    it('marks verified and consumes the token', async () => {
      harness.tokens.first.mockResolvedValue(authToken());

      await expect(service.verifyEmail({ token: 'raw' })).resolves.toEqual({
        verified: true,
      });
      expect(harness.users.update).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerifiedAt: expect.any(String) }),
      );
      expect(harness.tokens.update).toHaveBeenCalledWith(
        expect.objectContaining({ consumedAt: expect.any(String) }),
      );
    });

    it('rejects bad, consumed and expired tokens', async () => {
      harness.tokens.first.mockResolvedValue(null);
      await expect(
        service.verifyEmail({ token: 'bad' }),
      ).rejects.toBeInstanceOf(BadRequestException);

      // A consumed token matches no live row: the isNull predicate filters
      // it at the database, so the lookup comes back empty.
      harness.tokens.first.mockResolvedValue(null);
      await expect(
        service.verifyEmail({ token: 'used' }),
      ).rejects.toBeInstanceOf(BadRequestException);

      harness.tokens.first.mockResolvedValue(authToken({ expiresAt: PAST }));
      await expect(
        service.verifyEmail({ token: 'old' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('resendVerification / forgotPassword', () => {
    it('always succeeds but only mails eligible users', async () => {
      harness.users.first.mockResolvedValue(user());
      harness.tokenNs.create.mockResolvedValue(authToken());

      await expect(
        service.resendVerification({ email: 'sara@example.com' }),
      ).resolves.toEqual({ sent: true });
      expect(harness.mailer.sendVerificationEmail).toHaveBeenCalledTimes(1);

      await expect(
        service.forgotPassword({ email: 'sara@example.com' }),
      ).resolves.toEqual({ sent: true });
      expect(harness.mailer.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

      harness.users.first.mockResolvedValue(null);
      await expect(
        service.resendVerification({ email: 'nobody@example.com' }),
      ).resolves.toEqual({ sent: true });
      await expect(
        service.forgotPassword({ email: 'nobody@example.com' }),
      ).resolves.toEqual({ sent: true });
      expect(harness.mailer.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(harness.mailer.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });

    it('does not resend for verified users', async () => {
      harness.users.first.mockResolvedValue(user({ emailVerifiedAt: STAMP }));

      await expect(
        service.resendVerification({ email: 'sara@example.com' }),
      ).resolves.toEqual({ sent: true });
      expect(harness.mailer.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('sets the hash, consumes the token and revokes sessions', async () => {
      harness.tokens.first.mockResolvedValue(
        authToken({ purpose: 'reset-password' }),
      );
      harness.sessions.all.mockResolvedValue([session()]);

      await expect(
        service.resetPassword({ token: 'raw', newPassword: 'N3w-p@ssphrase' }),
      ).resolves.toEqual({ reset: true });
      expect(harness.users.update).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'hash:N3w-p@ssphrase' }),
      );
      expect(harness.sessions.update).toHaveBeenCalled();
    });

    it('rejects bad tokens', async () => {
      harness.tokens.first.mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'bad', newPassword: 'N3w-p@ssphrase' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('rotates the hash and revokes sessions', async () => {
      harness.userNs.first.mockResolvedValue(user());
      harness.sessions.all.mockResolvedValue([session()]);

      await expect(
        service.changePassword(1, {
          currentPassword: 'S3cure-p@ssphrase',
          newPassword: 'N3w-p@ssphrase',
        }),
      ).resolves.toEqual({ changed: true });
      expect(harness.sessions.update).toHaveBeenCalled();
    });

    it('rejects wrong current passwords', async () => {
      harness.users.first.mockResolvedValue(user());

      await expect(
        service.changePassword(1, {
          currentPassword: 'wrong',
          newPassword: 'N3w-p@ssphrase',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(harness.users.update).not.toHaveBeenCalled();
    });
  });

  describe('validateSessionUser', () => {
    it('maps DB roles to the app vocabulary', async () => {
      harness.userNs.first.mockResolvedValue(user({ role: 'admin' }));

      const result = await service.validateSessionUser(1);

      expect(result).toEqual({
        id: 1,
        email: 'sara@example.com',
        role: 'Admin',
        operatorId: null,
        emailVerified: false,
      });
    });

    it('rejects missing and inactive users', async () => {
      harness.userNs.first.mockResolvedValue(null);
      await expect(service.validateSessionUser(1)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );

      harness.userNs.first.mockResolvedValue(user({ isActive: false }));
      await expect(service.validateSessionUser(1)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});

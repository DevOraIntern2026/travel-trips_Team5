import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard.js';

function setup(options: {
  isPublic?: boolean;
  authorization?: string;
  verify?: unknown;
  sessionUser?: unknown;
}) {
  const reflector = {
    getAllAndOverride: vi.fn(() => options.isPublic ?? false),
  } as unknown as Reflector;
  const jwt = {
    verifyAsync: options.verify
      ? vi.fn(async () => options.verify)
      : vi.fn(async () => {
          throw new Error('bad token');
        }),
  };
  const auth = {
    validateSessionUser:
      options.sessionUser !== undefined
        ? vi.fn(async () => options.sessionUser)
        : vi.fn(async () => {
            throw new UnauthorizedException();
          }),
  };
  const req: { headers: Record<string, string>; user?: unknown } = {
    headers: options.authorization
      ? { authorization: options.authorization }
      : {},
  };
  const getRequest = vi.fn(() => req);
  const context = {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({ getRequest }),
  } as unknown as ExecutionContext;
  const guard = new JwtAuthGuard(reflector, jwt as never, auth as never);
  return { guard, context, jwt, auth, getRequest };
}

describe('JwtAuthGuard', () => {
  it('skips @Public() routes without touching JWT', async () => {
    const { guard, context, jwt } = setup({ isPublic: true });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('attaches the session user for valid tokens', async () => {
    const user = { id: 1, role: 'Admin' };
    const { guard, context, getRequest } = setup({
      authorization: 'Bearer good-token',
      verify: { sub: 1 },
      sessionUser: user,
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(getRequest().user).toBe(user);
  });

  it('rejects missing headers, bad tokens and bad subjects', async () => {
    const noHeader = setup({});
    await expect(
      noHeader.guard.canActivate(noHeader.context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const badToken = setup({ authorization: 'Bearer bad' });
    await expect(
      badToken.guard.canActivate(badToken.context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const badSubject = setup({
      authorization: 'Bearer x',
      verify: { sub: 'not-a-number' },
      sessionUser: { id: 1 },
    });
    await expect(
      badSubject.guard.canActivate(badSubject.context),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects when the session user is unusable', async () => {
    const { guard, context } = setup({
      authorization: 'Bearer good-token',
      verify: { sub: 1 },
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});

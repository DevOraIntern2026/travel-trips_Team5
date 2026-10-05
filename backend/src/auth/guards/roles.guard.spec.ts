import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { RolesGuard } from './roles.guard.js';

function setup(metadata: Record<string, unknown>, user?: unknown) {
  const reflector = {
    getAllAndOverride: vi.fn((key: string) => metadata[key]),
  } as unknown as Reflector;
  const context = {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
  return new RolesGuard(reflector).canActivate(context);
}

describe('RolesGuard', () => {
  it('allows @Public() routes without a user', () => {
    expect(
      setup({ [IS_PUBLIC_KEY]: true, [ROLES_KEY]: ['Admin'] }, undefined),
    ).toBe(true);
  });

  it('allows routes with no role metadata', () => {
    expect(setup({}, { role: 'Customer' })).toBe(true);
  });

  it('allows a user with a required role', () => {
    expect(setup({ [ROLES_KEY]: ['Admin'] }, { id: 1, role: 'Admin' })).toBe(
      true,
    );
  });

  it('rejects a user with the wrong role', () => {
    expect(() =>
      setup({ [ROLES_KEY]: ['Admin'] }, { id: 2, role: 'Operator' }),
    ).toThrow(ForbiddenException);
  });

  it('rejects anonymous access to guarded routes', () => {
    expect(() => setup({ [ROLES_KEY]: ['Admin'] }, undefined)).toThrow(
      ForbiddenException,
    );
  });

  it('rejects unknown role strings (deny-by-default)', () => {
    expect(() =>
      setup({ [ROLES_KEY]: ['Admin'] }, { id: 3, role: 'SuperAdmin' }),
    ).toThrow(ForbiddenException);
  });
});

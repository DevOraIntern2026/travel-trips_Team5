import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../src/auth/password.service.js';
import { db } from '../../src/prisma/db.js';

const passwords = new PasswordService();

export interface TestIdentity {
  email: string;
  role?: 'Admin' | 'Operator' | 'Customer';
  operatorId?: number | null;
}

/**
 * Mints a real signed access token for a freshly seeded user WITHOUT going
 * through register/login HTTP (no argon2 verify round-trips per test).
 * The token is verified by the same JwtService + secret as the app, and
 * RolesGuard reloads identity from the DB — so this exercises the real
 * guard chain. Login flows themselves are covered in auth.e2e-spec.ts.
 */
export async function authHeaderFor(
  identity: TestIdentity,
  password = 'T3st-p@ssphrase',
): Promise<string> {
  const role = identity.role ?? 'Customer';
  const created = await db.orm.public.User.create({
    email: identity.email,
    passwordHash: await passwords.hash(password),
    role: role.toLowerCase() as 'admin' | 'operator' | 'customer',
    ...(identity.operatorId !== undefined && identity.operatorId !== null
      ? { operatorId: identity.operatorId }
      : {}),
  });
  const jwt = new JwtService({ secret: process.env['JWT_SECRET'] });
  const accessToken = await jwt.signAsync({
    sub: created.id,
    email: identity.email,
    role,
    operatorId: identity.operatorId ?? null,
    emailVerified: false,
  });
  return `Bearer ${accessToken}`;
}

/** Admin variant of authHeaderFor for management endpoints. */
export async function adminHeader(): Promise<string> {
  return authHeaderFor({ email: 'admin@example.com', role: 'Admin' });
}

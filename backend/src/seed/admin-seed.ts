import { db } from '../prisma/db.js';
import { PasswordService } from '../auth/password.service.js';

export interface SeedAdminOptions {
  email: string;
  password: string;
}

export type SeedAdminResult =
  { status: 'created'; id: number } | { status: 'exists'; id: number };

/**
 * Creates the initial admin account. Safe to re-run: an existing email is
 * reported, never modified. Throws when credentials are missing.
 */
export async function seedAdmin(
  options: SeedAdminOptions,
  overrides?: { passwords?: PasswordService },
): Promise<SeedAdminResult> {
  const email = options.email.trim().toLowerCase();
  const password = options.password;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must both be set');
  }
  const existing = await db.orm.public.User.where((u) =>
    u.email.eq(email),
  ).first();
  if (existing) {
    return { status: 'exists', id: existing.id };
  }
  const passwords = overrides?.passwords ?? new PasswordService();
  const created = await db.orm.public.User.create({
    email,
    passwordHash: await passwords.hash(password),
    role: 'admin',
    emailVerifiedAt: new Date().toISOString(),
  });
  return { status: 'created', id: created.id };
}

import type { UserRole } from './roles.decorator.js';

/** Database role values are lowercase; the app vocabulary is PascalCase. */
export type DbRole = 'admin' | 'operator' | 'customer';

const DB_TO_APP_ROLE: Record<DbRole, UserRole> = {
  admin: 'Admin',
  operator: 'Operator',
  customer: 'Customer',
};

/** Normalize a stored role to the app vocabulary; throws on unknown values. */
export function toUserRole(role: string): UserRole {
  const normalized = DB_TO_APP_ROLE[role.toLowerCase() as DbRole];
  if (!normalized) {
    throw new Error(`Unknown role value: ${role}`);
  }
  return normalized;
}

/**
 * Identity attached to requests by JwtAuthGuard and consumed by RolesGuard
 * (role) and Backend 3 (id/role/operator scoping). Mirrors the JWT claims.
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
  operatorId: number | null;
  emailVerified: boolean;
}

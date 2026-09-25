import { SetMetadata } from '@nestjs/common';

/**
 * Roles are owned by Backend 1 (auth). This union must stay in sync with the
 * Backend 1 role vocabulary: exactly 'Admin' | 'Operator' | 'Customer'.
 */
export type UserRole = 'Admin' | 'Operator' | 'Customer';

export const ROLES_KEY = 'roles';

/**
 * Declares which roles may access a route. Enforced by RolesGuard once it is
 * registered (TODO(backend-1)). Until then the metadata documents intent.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

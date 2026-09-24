import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator.js';

interface AuthenticatedRequest {
  user?: {
    id?: number | string;
    role?: unknown;
  };
}

/**
 * Enforces @Roles() metadata against `request.user.role` (populated by the
 * Backend 1 auth guard). Deny-by-default: a route requiring roles rejects
 * missing users, missing roles, and unknown role strings.
 *
 * NOT registered yet (TODO(backend-1)): register as a global APP_GUARD together
 * with the Backend 1 JWT guard that populates `request.user`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role: unknown = request.user?.role;
    if (typeof role !== 'string' || !requiredRoles.includes(role as UserRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}

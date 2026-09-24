import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../authenticated-user.js';

/**
 * Reads the identity JwtAuthGuard attached. Only usable on non-@Public()
 * routes, where the guard guarantees request.user is populated.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser =>
    ctx.switchToHttp().getRequest().user,
);

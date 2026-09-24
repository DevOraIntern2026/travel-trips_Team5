import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { AuthService } from './auth.service.js';

/**
 * Authenticates Bearer access tokens and populates request.user for
 * RolesGuard and handlers. Skips @Public() routes. Registered globally
 * (APP_GUARD) ahead of RolesGuard: authentication first, authorization after.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<{ headers?: { authorization?: unknown }; user?: unknown }>();
    const header = request.headers?.authorization;
    const token =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice('Bearer '.length).trim()
        : undefined;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: unknown = await this.jwt.verifyAsync(token);
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('sub' in payload) ||
        typeof payload.sub !== 'number'
      ) {
        throw new UnauthorizedException();
      }
      request.user = await this.auth.validateSessionUser(payload.sub);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }
}

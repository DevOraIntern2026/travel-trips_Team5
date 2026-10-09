import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as publicly accessible. Public routes skip the global
 * JwtAuthGuard/RolesGuard; everything else requires authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

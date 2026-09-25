import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as publicly accessible (no role required).
 * TODO(backend-1): remove once a global auth guard is registered —
 * public routes stay public, everything else will require authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

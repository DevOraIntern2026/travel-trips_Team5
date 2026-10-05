import { createHash, randomBytes } from 'node:crypto';

/** Opaque token for refresh sessions and emailed links (256 bits). */
export function randomToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Store only the hash; the raw token is shown to the owner exactly once. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

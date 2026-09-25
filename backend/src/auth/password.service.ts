import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

/**
 * Thin wrapper over argon2id so hashing is mockable in unit tests and
 * swappable (e.g. bcrypt) without touching call sites.
 */
@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      // Malformed hashes fail closed instead of throwing 500s.
      return false;
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleProfile {
  email: string;
  name?: string;
}

/**
 * Thin wrapper over google-auth-library so ID-token verification is
 * mockable in unit tests.
 */
@Injectable()
export class GoogleAuthService {
  private readonly clientId: string | undefined;

  constructor(config: ConfigService) {
    this.clientId = config.get<string>('GOOGLE_CLIENT_ID');
  }

  async verify(idToken: string): Promise<GoogleProfile> {
    if (!this.clientId) {
      throw new BadRequestException('Google sign-in is not configured');
    }
    const client = new OAuth2Client(this.clientId);
    let payload: { email?: string; name?: string } | undefined;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      payload = ticket.getPayload();
    } catch {
      // Malformed, expired or foreign tokens are a client error, not a 500.
      throw new BadRequestException('Invalid Google token');
    }
    if (!payload?.email) {
      throw new BadRequestException('Google token has no email');
    }
    return { email: payload.email.toLowerCase(), name: payload.name };
  }
}

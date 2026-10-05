import { Injectable, Logger } from '@nestjs/common';
import type { Mailer, VerificationMail } from './mailer.port.js';

/**
 * Development mailer: logs links instead of sending. Tokens are secrets, so
 * they go through the redacted logger pipeline like any other credential.
 * TODO(team): replace with a real provider behind MAILER_PROVIDER.
 */
@Injectable()
export class LogMailerService implements Mailer {
  private readonly logger = new Logger(LogMailerService.name);

  async sendVerificationEmail(mail: VerificationMail): Promise<void> {
    this.logger.log(`Verification link for ${mail.to}: ${mail.link}`);
  }

  async sendPasswordResetEmail(mail: VerificationMail): Promise<void> {
    this.logger.log(`Password-reset link for ${mail.to}: ${mail.link}`);
  }
}

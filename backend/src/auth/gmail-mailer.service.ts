import { Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Mailer, VerificationMail } from './mailer.port.js';

/**
 * Gmail SMTP mailer (STARTTLS on smtp.gmail.com:587).
 *
 * Needs a Google **App Password**, not the account password:
 * Google Account → Security → 2-Step Verification → App passwords.
 * Constructed manually by the MAILER_PROVIDER factory with credentials
 * from GMAIL_USER / GMAIL_APP_PASSWORD.
 */
export class GmailMailerService implements Mailer {
  private readonly logger = new Logger(GmailMailerService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(user: string, appPassword: string) {
    this.from = `"Travel Trips" <${user}>`;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass: appPassword },
    });
  }

  async sendVerificationEmail(mail: VerificationMail): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: mail.to,
      subject: 'Verify your Travel Trips email',
      text: `Welcome to Travel Trips!\n\nConfirm your email address:\n${mail.link}\n\nThis link expires in 24 hours.`,
    });
    this.logger.log(`Verification email sent to ${mail.to}`);
  }

  async sendPasswordResetEmail(mail: VerificationMail): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: mail.to,
      subject: 'Reset your Travel Trips password',
      text: `Choose a new password here:\n${mail.link}\n\nThis link expires in 1 hour. If you did not ask for this, ignore this email.`,
    });
    this.logger.log(`Password-reset email sent to ${mail.to}`);
  }
}

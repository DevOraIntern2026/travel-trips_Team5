export interface VerificationMail {
  to: string;
  link: string;
}

/**
 * Outbound mail contract. Gmail (SMTP) is used when GMAIL_USER and
 * GMAIL_APP_PASSWORD are set; otherwise the LogMailerService development
 * fallback logs links instead of sending.
 * TODO(team): replace with a dedicated provider (SMTP/Resend/…) if Gmail
 * limits become an issue.
 */
export interface Mailer {
  sendVerificationEmail(mail: VerificationMail): Promise<void>;
  sendPasswordResetEmail(mail: VerificationMail): Promise<void>;
}

export const MAILER_PROVIDER = Symbol('MAILER_PROVIDER');

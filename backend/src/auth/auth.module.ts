import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { GmailMailerService } from './gmail-mailer.service.js';
import { GoogleAuthService } from './google-auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { LogMailerService } from './log-mailer.service.js';
import { MAILER_PROVIDER, type Mailer } from './mailer.port.js';
import { PasswordService } from './password.service.js';
import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('JWT_ACCESS_TTL_SEC') ?? 900,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    GoogleAuthService,
    LogMailerService,
    JwtAuthGuard,
    // Gmail when credentials are configured, log fallback otherwise (dev,
    // tests). E2E overrides this token with a capturing fake.
    {
      provide: MAILER_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Mailer => {
        const user = config.get<string>('GMAIL_USER');
        const appPassword = config.get<string>('GMAIL_APP_PASSWORD');
        return user && appPassword
          ? new GmailMailerService(user, appPassword)
          : new LogMailerService();
      },
    },
    // Global, in order: authenticate first, then authorize. From here on,
    // every non-@Public() route requires a valid JWT, and @Roles() routes
    // additionally require the role.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}

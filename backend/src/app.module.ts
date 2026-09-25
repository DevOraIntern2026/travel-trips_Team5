import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DestinationsModule } from './destinations/destinations.module.js';
import { OperatorsModule } from './operators/operators.module.js';
import { TripsModule } from './trips/trips.module.js';
import { TripDatesModule } from './trip-dates/trip-dates.module.js';
import { UsersModule } from './users/users.module.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the config available globally without needing to import ConfigModule elsewhere
      validationSchema: envValidationSchema,
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        appKey: config.get<string>('OBSERVE_APP_KEY')!,
        appSecret: config.get<string>('OBSERVE_APP_SECRET')!,
        serviceId: 'backend',
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // limit each IP to 10 requests per ttl
      },
    ]),
    DestinationsModule,
    TripsModule,
    TripDatesModule,
    AuthModule,
    UsersModule,
    OperatorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

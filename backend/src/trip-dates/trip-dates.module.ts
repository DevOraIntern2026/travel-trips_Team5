import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { BOOKING_SEATS_PROVIDER } from '../bookings/booking-seats.port.js';
import { NoopBookingSeatsProvider } from '../bookings/noop-booking-seats.provider.js';
import { TripDatesController } from './trip-dates.controller.js';
import { TripDatesService } from './trip-dates.service.js';

@Module({
  controllers: [TripDatesController],
  providers: [
    TripDatesService,
    RolesGuard,
    // TODO(backend-3): swap for the real booking-count provider. The
    // service only depends on the BOOKING_SEATS_PROVIDER port.
    {
      provide: BOOKING_SEATS_PROVIDER,
      useClass: NoopBookingSeatsProvider,
    },
  ],
  exports: [TripDatesService],
})
export class TripDatesModule {}

import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard.js';
import { BOOKING_SEATS_PROVIDER } from '../bookings/booking-seats.port.js';
import { NoopBookingSeatsProvider } from '../bookings/noop-booking-seats.provider.js';
import { AdminTripsController } from './admin-trips.controller.js';
import { OperatorTripsController } from './operator-trips.controller.js';
import { TripsController } from './trips.controller.js';
import { TripsService } from './trips.service.js';

@Module({
  controllers: [TripsController, AdminTripsController, OperatorTripsController],
  // RolesGuard is provided but NOT registered as a global guard yet:
  // TODO(backend-1): register as APP_GUARD alongside the JWT guard that
  // populates request.user. Until then management routes stay public.
  // The seats provider is scoped here (same as TripDatesModule) until
  // Backend 3 supplies the real booking-count provider.
  providers: [
    TripsService,
    RolesGuard,
    {
      provide: BOOKING_SEATS_PROVIDER,
      useClass: NoopBookingSeatsProvider,
    },
  ],
  exports: [TripsService],
})
export class TripsModule {}

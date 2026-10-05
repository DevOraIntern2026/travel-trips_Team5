import { Module } from '@nestjs/common';
import { BOOKING_SEATS_PROVIDER } from './booking-seats.port.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { ConfirmedBookingSeatsProvider } from './confirmed-booking-seats.provider.js';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    {
      provide: BOOKING_SEATS_PROVIDER,
      useClass: ConfirmedBookingSeatsProvider,
    },
  ],
  exports: [BookingsService, BOOKING_SEATS_PROVIDER],
})
export class BookingsModule {}

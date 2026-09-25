import { Injectable } from '@nestjs/common';
import type { BookingSeatsProvider } from './booking-seats.port.js';

/**
 * Stand-in until Backend 3 provides real booking counts.
 * TODO(backend-3): replace this provider with one that sums confirmed
 * bookings per trip date. All capacity-vs-booked checks consult the port,
 * so swapping the provider is the only change needed.
 */
@Injectable()
export class NoopBookingSeatsProvider implements BookingSeatsProvider {
  async getConfirmedBookedSeats(): Promise<number> {
    return 0;
  }
}

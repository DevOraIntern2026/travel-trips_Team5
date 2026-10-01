import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';
import type { BookingSeatsProvider } from './booking-seats.port.js';

/**
 * Backend 3 counts: the number of Confirmed bookings for a trip date.
 * Consumed by Backend 2 (trips, trip-dates) through BOOKING_SEATS_PROVIDER
 * for capacity-vs-booked checks and availability responses.
 */
@Injectable()
export class ConfirmedBookingSeatsProvider implements BookingSeatsProvider {
  async getConfirmedBookedSeats(tripDateId: number): Promise<number> {
    const { total } = await db.orm.public.Booking.where((b) =>
      b.tripDateId.eq(tripDateId),
    )
      .where((b) => b.status.eq('Confirmed'))
      .aggregate((a) => ({ total: a.count() }));
    return total;
  }
}

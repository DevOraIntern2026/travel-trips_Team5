/**
 * Contract owned by Backend 3 (bookings), consumed by Backend 2 (trips).
 *
 * Returns the number of CONFIRMED booked seats for a trip date. Backend 3
 * will back this with real booking counts; until then a stub returns 0.
 */
export interface BookingSeatsProvider {
  getConfirmedBookedSeats(tripDateId: number): Promise<number>;
}

export const BOOKING_SEATS_PROVIDER = Symbol('BOOKING_SEATS_PROVIDER');

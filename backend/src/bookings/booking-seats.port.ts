/**
 * Contract owned by Backend 3 (bookings), consumed by Backend 2 (trips).
 *
 * Returns the number of CONFIRMED booked seats for a trip date, backed by
 * ConfirmedBookingSeatsProvider which counts confirmed Booking rows.
 */
export interface BookingSeatsProvider {
  getConfirmedBookedSeats(tripDateId: number): Promise<number>;
}

export const BOOKING_SEATS_PROVIDER = Symbol('BOOKING_SEATS_PROVIDER');

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmedBookingSeatsProvider } from './confirmed-booking-seats.provider.js';

const harness = vi.hoisted(() => {
  const bookingCollection = {
    where: vi.fn(),
    aggregate: vi.fn(),
  };
  bookingCollection.where.mockReturnValue(bookingCollection);
  const db = {
    orm: { public: { Booking: { where: vi.fn(() => bookingCollection) } } },
  };
  return { db, bookingCollection };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

describe('ConfirmedBookingSeatsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    harness.db.orm.public.Booking.where.mockReturnValue(
      harness.bookingCollection,
    );
    harness.bookingCollection.where.mockReturnValue(harness.bookingCollection);
  });

  it('counts confirmed bookings for the trip date', async () => {
    harness.bookingCollection.aggregate.mockResolvedValue({ total: 3 });
    const provider = new ConfirmedBookingSeatsProvider();

    await expect(provider.getConfirmedBookedSeats(10)).resolves.toBe(3);

    expect(harness.db.orm.public.Booking.where).toHaveBeenCalledTimes(1);
    // Status + trip-date predicates AND-compose.
    expect(harness.bookingCollection.where).toHaveBeenCalledTimes(1);
    expect(harness.bookingCollection.aggregate).toHaveBeenCalledTimes(1);
  });

  it('returns zero when nothing is booked', async () => {
    harness.bookingCollection.aggregate.mockResolvedValue({ total: 0 });

    await expect(
      new ConfirmedBookingSeatsProvider().getConfirmedBookedSeats(10),
    ).resolves.toBe(0);
  });
});

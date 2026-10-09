import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service.js';

const harness = vi.hoisted(() => {
  const build = () => {
    const stub = {
      where: vi.fn(),
      orderBy: vi.fn(),
      limit: vi.fn(),
      offset: vi.fn(),
      all: vi.fn(),
      first: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    };
    stub.where.mockReturnValue(stub);
    stub.orderBy.mockReturnValue(stub);
    stub.limit.mockReturnValue(stub);
    stub.offset.mockReturnValue(stub);
    return stub;
  };
  const tripDateCollection = build();
  const tripCollection = build();
  const bookingCollection = build();
  const txTripDateCollection = build();
  const txTripCollection = build();
  const txBookingCollection = build();
  const txDb = {
    orm: {
      public: {
        TripDate: { where: vi.fn(() => txTripDateCollection) },
        Trip: { where: vi.fn(() => txTripCollection) },
        Booking: {
          where: vi.fn(() => txBookingCollection),
          create: vi.fn(),
        },
      },
    },
  };
  const db = {
    orm: {
      public: {
        TripDate: { where: vi.fn(() => tripDateCollection) },
        Trip: { where: vi.fn(() => tripCollection) },
        Booking: {
          where: vi.fn(() => bookingCollection),
          create: vi.fn(),
        },
      },
    },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    txDb,
    tripDateCollection,
    tripCollection,
    bookingCollection,
    txTripDateCollection,
    txTripCollection,
    txBookingCollection,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

function futureIso(daysAhead: number): string {
  return new Date(Date.now() + daysAhead * 86_400_000).toISOString();
}

function tripDate(overrides = {}) {
  return {
    id: 10,
    tripId: 1,
    startDate: futureIso(5),
    endDate: futureIso(8),
    price: '100',
    capacity: 2,
    bookedSeats: 0,
    isActive: true,
    ...overrides,
  };
}

function trip(overrides = {}) {
  return {
    id: 1,
    isActive: true,
    cancellationWindowHours: 24,
    ...overrides,
  };
}

function booking(overrides = {}) {
  return {
    id: 100,
    customerId: 7,
    tripId: 1,
    tripDateId: 10,
    price: '100',
    status: 'Confirmed',
    ...overrides,
  };
}

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.db.transaction.mockImplementation((cb) => cb(harness.txDb));
    service = new BookingsService();
  });

  describe('createBooking', () => {
    it('claims a seat and creates the booking', async () => {
      harness.txTripDateCollection.first.mockResolvedValue(tripDate());
      harness.txTripCollection.first.mockResolvedValue(trip());
      harness.txTripDateCollection.update.mockResolvedValue(
        tripDate({ bookedSeats: 1 }),
      );
      harness.txDb.orm.public.Booking.create.mockResolvedValue(booking());

      const result = await service.createBooking(7, { tripDateId: 10 });

      expect(result.customerId).toBe(7);
      expect(harness.txTripDateCollection.update).toHaveBeenCalledWith({
        bookedSeats: 1,
      });
      expect(harness.txDb.orm.public.Booking.create).toHaveBeenCalledWith({
        customerId: 7,
        tripId: 1,
        tripDateId: 10,
        price: '100',
        status: 'Confirmed',
      });
    });

    it('throws NotFoundException for unknown trip dates', async () => {
      harness.txTripDateCollection.first.mockResolvedValue(null);

      await expect(
        service.createBooking(7, { tripDateId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.txDb.orm.public.Booking.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for inactive trips or dates', async () => {
      harness.txTripDateCollection.first.mockResolvedValue(
        tripDate({ isActive: false }),
      );
      harness.txTripCollection.first.mockResolvedValue(trip());

      await expect(
        service.createBooking(7, { tripDateId: 10 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      harness.txTripDateCollection.first.mockResolvedValue(tripDate());
      harness.txTripCollection.first.mockResolvedValue(
        trip({ isActive: false }),
      );
      await expect(
        service.createBooking(7, { tripDateId: 10 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects past trip dates with 400', async () => {
      harness.txTripDateCollection.first.mockResolvedValue(
        tripDate({
          startDate: new Date(Date.now() - 86_400_000).toISOString(),
          endDate: futureIso(2),
        }),
      );
      harness.txTripCollection.first.mockResolvedValue(trip());

      await expect(
        service.createBooking(7, { tripDateId: 10 }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(harness.txTripDateCollection.update).not.toHaveBeenCalled();
    });

    it('throws ConflictException when full', async () => {
      harness.txTripDateCollection.first.mockResolvedValue(
        tripDate({ bookedSeats: 2 }),
      );
      harness.txTripCollection.first.mockResolvedValue(trip());

      await expect(
        service.createBooking(7, { tripDateId: 10 }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.txTripDateCollection.update).not.toHaveBeenCalled();
    });

    it('retries the seat claim after a concurrent update', async () => {
      harness.txTripDateCollection.first
        .mockResolvedValueOnce(tripDate({ bookedSeats: 0 }))
        .mockResolvedValueOnce(tripDate({ bookedSeats: 1 }));
      harness.txTripCollection.first.mockResolvedValue(trip());
      harness.txTripDateCollection.update
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(tripDate({ bookedSeats: 2 }));
      harness.txDb.orm.public.Booking.create.mockResolvedValue(booking());

      await service.createBooking(7, { tripDateId: 10 });

      expect(harness.txTripDateCollection.update).toHaveBeenCalledTimes(2);
      expect(harness.txTripDateCollection.update).toHaveBeenLastCalledWith({
        bookedSeats: 2,
      });
    });
  });

  describe('getBooking', () => {
    it('returns the booking for its owner', async () => {
      harness.bookingCollection.first.mockResolvedValue(booking());

      await expect(service.getBooking(7, 100)).resolves.toMatchObject({
        id: 100,
      });
    });

    it('throws NotFoundException when missing', async () => {
      harness.bookingCollection.first.mockResolvedValue(null);

      await expect(service.getBooking(7, 999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException for other customers', async () => {
      harness.bookingCollection.first.mockResolvedValue(booking());

      await expect(service.getBooking(8, 100)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('cancelBooking', () => {
    it('cancels and releases the seat', async () => {
      harness.txBookingCollection.first.mockResolvedValue(booking());
      harness.txTripDateCollection.first.mockResolvedValue(
        tripDate({ bookedSeats: 1 }),
      );
      harness.txTripCollection.first.mockResolvedValue(trip());
      harness.txBookingCollection.update.mockResolvedValue(
        booking({ status: 'Cancelled' }),
      );
      harness.txTripDateCollection.update.mockResolvedValue(
        tripDate({ bookedSeats: 0 }),
      );

      const result = await service.cancelBooking(7, 100);

      expect(result.status).toBe('Cancelled');
      expect(harness.txTripDateCollection.update).toHaveBeenCalledWith({
        bookedSeats: 0,
      });
    });

    it('throws ConflictException when already cancelled', async () => {
      harness.txBookingCollection.first.mockResolvedValue(
        booking({ status: 'Cancelled' }),
      );

      await expect(service.cancelBooking(7, 100)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(harness.txBookingCollection.update).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException for other customers', async () => {
      harness.txBookingCollection.first.mockResolvedValue(booking());

      await expect(service.cancelBooking(8, 100)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('maps a lost status race to already-cancelled', async () => {
      harness.txBookingCollection.first.mockResolvedValue(booking());
      harness.txTripDateCollection.first.mockResolvedValue(tripDate());
      harness.txTripCollection.first.mockResolvedValue(trip());
      harness.txBookingCollection.update.mockResolvedValue(null);
      harness.txBookingCollection.first.mockResolvedValue(
        booking({ status: 'Cancelled' }),
      );

      await expect(service.cancelBooking(7, 100)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(harness.txTripDateCollection.update).not.toHaveBeenCalled();
    });

    it('rejects cancellations past the window', async () => {
      harness.txBookingCollection.first.mockResolvedValue(booking());
      harness.txTripDateCollection.first.mockResolvedValue(
        tripDate({
          startDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          endDate: futureIso(2),
        }),
      );
      harness.txTripCollection.first.mockResolvedValue(
        trip({ cancellationWindowHours: 48 }),
      );

      await expect(service.cancelBooking(7, 100)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });
});

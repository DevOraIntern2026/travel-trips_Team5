import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { TripDatesService } from './trip-dates.service.js';
import type { TripDateRow } from './trip-dates.service.js';

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
  const collection = build();
  const txCollection = build();
  const tripDateNamespace = {
    where: vi.fn(() => collection),
    create: vi.fn(),
  };
  const tripNamespace = { first: vi.fn() };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDb = { orm: { public: { TripDate: txNamespace } } };
  const db = {
    orm: {
      public: { TripDate: tripDateNamespace, Trip: tripNamespace },
    },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    tripDateNamespace,
    tripNamespace,
    collection,
    txNamespace,
    txCollection,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-24T00:00:00.000Z';

function dateRow(overrides: Partial<TripDateRow> = {}): TripDateRow {
  return {
    id: 10,
    tripId: 1,
    startDate: '2026-10-01T10:00:00.000Z',
    endDate: '2026-10-05T18:00:00.000Z',
    price: '99.99',
    capacity: 20,
    bookedSeats: 0,
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

function activeTrip() {
  return { id: 1, isActive: true };
}

describe('TripDatesService', () => {
  let service: TripDatesService;
  let bookedSeats: number;
  let getConfirmedBookedSeats: any;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.tripDateNamespace.where.mockReturnValue(harness.collection);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    bookedSeats = 0;
    getConfirmedBookedSeats = vi.fn(async () => bookedSeats);
    service = new TripDatesService({ getConfirmedBookedSeats });
  });

  describe('findAll', () => {
    it('returns paginated data with metadata', async () => {
      const rows = [dateRow(), dateRow({ id: 11 })];
      harness.txCollection.all.mockResolvedValue(rows);
      harness.txCollection.aggregate.mockResolvedValue({ total: 12 });
      harness.tripNamespace.first.mockResolvedValue(activeTrip());

      const result = await service.findAll(1, { page: 2, limit: 5 });

      expect(result.data).toEqual([
        { ...rows[0], price: 99.99 },
        { ...rows[1], price: 99.99 },
      ]);
      expect(result.meta).toEqual({
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      });
      expect(harness.txCollection.offset).toHaveBeenCalledWith(5);
    });

    it('throws NotFoundException for unknown or inactive trips', async () => {
      harness.tripNamespace.first.mockResolvedValue(null);

      await expect(
        service.findAll(999, { page: 1, limit: 10 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      harness.tripNamespace.first.mockResolvedValue({ id: 1, isActive: false });
      await expect(
        service.findAll(1, { page: 1, limit: 10 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('returns the date with a numeric price', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(dateRow());

      const result = await service.findOne(1, 10);

      expect(result.price).toBe(99.99);
      expect(result.capacity).toBe(20);
    });

    it('throws NotFoundException when missing, inactive or mismatched', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      harness.collection.first.mockResolvedValue(dateRow({ isActive: false }));
      await expect(service.findOne(1, 10)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const dto = {
      startDate: '2026-10-01T10:00:00.000Z',
      endDate: '2026-10-05T18:00:00.000Z',
      price: 99.99,
      capacity: 20,
    };

    it('creates a date for an active trip', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.tripDateNamespace.create.mockResolvedValue(dateRow());

      const result = await service.create(1, dto);

      expect(harness.tripDateNamespace.create).toHaveBeenCalledWith({
        tripId: 1,
        startDate: dto.startDate,
        endDate: dto.endDate,
        // Decimal-string codec form, not the DTO number.
        price: '99.99',
        capacity: 20,
      });
      expect(result.price).toBe(99.99);
    });

    it('rejects endDate before startDate with 400', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());

      await expect(
        service.create(1, {
          ...dto,
          startDate: dto.endDate,
          endDate: dto.startDate,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(harness.tripDateNamespace.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown trips', async () => {
      harness.tripNamespace.first.mockResolvedValue(null);

      await expect(service.create(999, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('maps CHECK violations to 400', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.tripDateNamespace.create.mockRejectedValue({
        sqlState: '23514',
      });

      await expect(service.create(1, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('updates and returns the date', async () => {
      harness.collection.first
        .mockResolvedValueOnce(dateRow())
        .mockResolvedValueOnce(dateRow({ price: '149.50', capacity: 15 }));
      harness.collection.update.mockResolvedValue([{}]);

      const result = await service.update(1, 10, {
        price: 149.5,
        capacity: 15,
      });

      expect(harness.collection.update).toHaveBeenCalledWith({
        price: '149.5',
        capacity: 15,
      });
      expect(result.price).toBe(149.5);
    });

    it('rejects an inverted range with 400', async () => {
      harness.collection.first.mockResolvedValue(dateRow());

      await expect(
        service.update(1, 10, { endDate: '2026-09-01T00:00:00.000Z' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('rejects capacity below booked seats with 409', async () => {
      bookedSeats = 8;
      harness.collection.first.mockResolvedValue(dateRow());

      await expect(
        service.update(1, 10, { capacity: 5 }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.collection.update).not.toHaveBeenCalled();
      expect(getConfirmedBookedSeats).toHaveBeenCalledWith(10);
    });

    it('allows capacity equal to booked seats', async () => {
      bookedSeats = 8;
      harness.collection.first.mockResolvedValue(dateRow());

      await service.update(1, 10, { capacity: 8 });

      expect(harness.collection.update).toHaveBeenCalledWith({ capacity: 8 });
    });

    it('returns the record unchanged when there is nothing to update', async () => {
      const existing = dateRow();
      harness.collection.first.mockResolvedValue(existing);

      const result = await service.update(1, 10, {});

      expect(result.price).toBe(99.99);
      expect(harness.collection.update).not.toHaveBeenCalled();
      expect(getConfirmedBookedSeats).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for dates of other trips', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(
        service.update(2, 10, { capacity: 5 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getAvailability', () => {
    it('derives remaining seats from capacity minus booked', async () => {
      bookedSeats = 8;
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(dateRow({ capacity: 30 }));

      const result = await service.getAvailability(1, 10);

      expect(result).toEqual({
        tripId: 1,
        dateId: 10,
        capacity: 30,
        bookedSeats: 8,
        remainingSeats: 22,
        available: true,
      });
      expect(getConfirmedBookedSeats).toHaveBeenCalledWith(10);
    });

    it('reports unavailable when fully booked', async () => {
      bookedSeats = 30;
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(dateRow({ capacity: 30 }));

      const result = await service.getAvailability(1, 10);

      expect(result.remainingSeats).toBe(0);
      expect(result.available).toBe(false);
    });

    it('clamps overbooking data at zero', async () => {
      bookedSeats = 35;
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(dateRow({ capacity: 30 }));

      const result = await service.getAvailability(1, 10);

      expect(result.remainingSeats).toBe(0);
      expect(result.available).toBe(false);
      expect(result.bookedSeats).toBe(35);
    });

    it('throws NotFoundException for missing or inactive dates', async () => {
      harness.tripNamespace.first.mockResolvedValue(activeTrip());
      harness.collection.first.mockResolvedValue(null);

      await expect(service.getAvailability(1, 999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(getConfirmedBookedSeats).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deactivates instead of deleting', async () => {
      // findScoped runs twice (pre-check, re-read): active, then deactivated.
      harness.collection.first
        .mockResolvedValueOnce(dateRow())
        .mockResolvedValueOnce(dateRow({ isActive: false }));

      const result = await service.remove(1, 10);

      expect(harness.collection.update).toHaveBeenCalledWith({
        isActive: false,
      });
      expect(result.isActive).toBe(false);
    });

    it('is idempotent for already-inactive dates', async () => {
      const inactive = dateRow({ isActive: false });
      harness.collection.first.mockResolvedValue(inactive);

      const result = await service.remove(1, 10);

      expect(result.isActive).toBe(false);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for dates of other trips', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(service.remove(2, 10)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});

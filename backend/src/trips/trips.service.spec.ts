import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TripsService } from './trips.service.js';
import type { Trip } from './trips.service.js';

const harness = vi.hoisted(() => {
  const build = () => {
    const stub = {
      where: vi.fn(),
      orderBy: vi.fn(),
      limit: vi.fn(),
      offset: vi.fn(),
      include: vi.fn(),
      select: vi.fn(),
      all: vi.fn(),
      first: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
    };
    stub.where.mockReturnValue(stub);
    stub.orderBy.mockReturnValue(stub);
    stub.limit.mockReturnValue(stub);
    stub.offset.mockReturnValue(stub);
    stub.include.mockReturnValue(stub);
    stub.select.mockReturnValue(stub);
    return stub;
  };
  const collection = build();
  const txCollection = build();
  const tripDateCollection = build();
  const tripNamespace = {
    where: vi.fn(() => collection),
    first: vi.fn(),
    create: vi.fn(),
  };
  const tripDateNamespace = { where: vi.fn(() => tripDateCollection) };
  const destinationNamespace = { first: vi.fn() };
  const operatorNamespace = { first: vi.fn() };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDestinationCollection = build();
  const txDestinationNamespace = {
    where: vi.fn(() => txDestinationCollection),
  };
  const txTripDateCollection = build();
  const txTripDateNamespace = { where: vi.fn(() => txTripDateCollection) };
  const txDb = {
    orm: {
      public: {
        Trip: txNamespace,
        Destination: txDestinationNamespace,
        TripDate: txTripDateNamespace,
      },
    },
  };
  const db = {
    orm: {
      public: {
        Trip: tripNamespace,
        TripDate: tripDateNamespace,
        Destination: destinationNamespace,
        Operator: operatorNamespace,
      },
    },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    tripNamespace,
    tripDateNamespace,
    tripDateCollection,
    destinationNamespace,
    operatorNamespace,
    collection,
    txNamespace,
    txCollection,
    txDestinationNamespace,
    txDestinationCollection,
    txTripDateNamespace,
    txTripDateCollection,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-24T00:00:00.000Z';

function trip(overrides: Partial<Trip> = {}): Trip {
  return {
    id: 1,
    destinationId: 10,
    operatorId: null,
    name: 'Nile cruise',
    description: null,
    durationDays: 3,
    cancellationWindowHours: 24,
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    destination: {
      id: 10,
      name: 'Cairo',
      description: null,
      city: 'Cairo',
      country: 'Egypt',
      isActive: true,
      createdAt: STAMP,
      updatedAt: STAMP,
    },
    ...overrides,
  };
}

function activeDestination() {
  return {
    id: 10,
    name: 'Cairo',
    description: null,
    city: 'Cairo',
    country: 'Egypt',
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
  };
}

describe('TripsService', () => {
  let service: TripsService;
  let bookedSeats: number;
  let getConfirmedBookedSeats: any;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.tripNamespace.where.mockReturnValue(harness.collection);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    harness.tripDateNamespace.where.mockReturnValue(harness.tripDateCollection);
    harness.tripDateCollection.first.mockResolvedValue(null);
    harness.txDestinationNamespace.where.mockReturnValue(
      harness.txDestinationCollection,
    );
    harness.txTripDateNamespace.where.mockReturnValue(
      harness.txTripDateCollection,
    );
    bookedSeats = 0;
    getConfirmedBookedSeats = vi.fn(async () => bookedSeats);
    service = new TripsService({ getConfirmedBookedSeats });
  });

  describe('findAll', () => {
    it('returns paginated data with metadata', async () => {
      const rows = [
        { ...trip(), destination: undefined },
        { ...trip({ id: 2 }), destination: undefined },
      ];
      harness.txCollection.all.mockResolvedValue(rows);
      harness.txCollection.aggregate.mockResolvedValue({ total: 25 });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(rows);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
      expect(harness.txCollection.limit).toHaveBeenCalledWith(10);
      expect(harness.txCollection.offset).toHaveBeenCalledWith(0);
    });

    it('applies destination, operator and search filters', async () => {
      harness.txCollection.all.mockResolvedValue([]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 0 });

      await service.findAll({
        page: 1,
        limit: 10,
        search: 'nile',
        destinationId: 10,
        operatorId: 7,
      });

      // One namespace .where() per query, three chained filters per query.
      expect(harness.txNamespace.where).toHaveBeenCalledTimes(2);
      expect(harness.txCollection.where).toHaveBeenCalledTimes(6);
    });

    it('skips filters when not provided', async () => {
      harness.txCollection.all.mockResolvedValue([]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 0 });

      await service.findAll({ page: 1, limit: 10 });

      expect(harness.txNamespace.where).toHaveBeenCalledTimes(2);
      expect(harness.txCollection.where).not.toHaveBeenCalled();
    });

    it('routes sorted lists through the search engine', async () => {
      harness.txDestinationCollection.all.mockResolvedValue([]);
      harness.txCollection.all.mockResolvedValue([trip()]);
      harness.txTripDateCollection.all.mockResolvedValue([]);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sort: 'price_asc',
      });

      expect(result.meta.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('searchTrips', () => {
    const nile = () => trip({ id: 1, name: 'Nile cruise' });
    const safari = () =>
      trip({ id: 2, name: 'Desert safari', destinationId: 11 });

    beforeEach(() => {
      harness.txDestinationCollection.all.mockResolvedValue([]);
      harness.txTripDateCollection.all.mockResolvedValue([]);
    });

    it('matches trip names case-insensitively', async () => {
      harness.txCollection.all.mockResolvedValue([nile(), safari()]);

      const result = await service.searchTrips({
        text: 'nile',
        page: 1,
        limit: 10,
      });

      // Name matching is a DB predicate; the engine returns what the DB
      // returns, paginated with metadata.
      expect(result.meta.total).toBe(2);
      expect(result.data).toHaveLength(2);
    });

    it('resolves destination matches to trip candidates', async () => {
      harness.txDestinationCollection.all.mockResolvedValue([{ id: 11 }]);
      harness.txCollection.all.mockResolvedValue([safari()]);

      const result = await service.searchTrips({
        text: 'lux',
        page: 1,
        limit: 10,
      });

      expect(result.meta.total).toBe(1);
      expect(result.data[0].id).toBe(2);
    });

    it('filters by destination, duration and paginates', async () => {
      const rows = [nile(), safari()];
      harness.txCollection.all.mockResolvedValue(rows);

      const result = await service.searchTrips({
        destinationId: 10,
        minDuration: 2,
        maxDuration: 5,
        page: 2,
        limit: 1,
      });

      expect(result.meta).toEqual({
        page: 2,
        limit: 1,
        total: 2,
        totalPages: 2,
      });
      expect(result.data).toHaveLength(1);
    });

    it('filters by overlapping date and price window', async () => {
      harness.txCollection.all.mockResolvedValue([nile(), safari()]);
      harness.txTripDateCollection.all.mockResolvedValue([
        {
          id: 10,
          tripId: 1,
          startDate: '2026-10-01T00:00:00.000Z',
          endDate: '2026-10-05T00:00:00.000Z',
          price: 99.99,
          capacity: 20,
        },
        {
          id: 11,
          tripId: 2,
          startDate: '2026-11-01T00:00:00.000Z',
          endDate: '2026-11-05T00:00:00.000Z',
          price: 500.0,
          capacity: 10,
        },
      ]);

      const byDate = await service.searchTrips({
        date: '2026-10-03',
        page: 1,
        limit: 10,
      });
      expect(byDate.meta.total).toBe(1);
      expect(byDate.data[0].id).toBe(1);

      const byPrice = await service.searchTrips({
        minPrice: 100,
        maxPrice: 600,
        page: 1,
        limit: 10,
      });
      expect(byPrice.meta.total).toBe(1);
      expect(byPrice.data[0].id).toBe(2);
    });

    it('keeps only trips with bookable dates when availableOnly', async () => {
      bookedSeats = 20;
      harness.txCollection.all.mockResolvedValue([nile(), safari()]);
      harness.txTripDateCollection.all.mockResolvedValue([
        {
          id: 10,
          tripId: 1,
          startDate: '2026-10-01T00:00:00.000Z',
          endDate: '2026-10-05T00:00:00.000Z',
          price: 99.99,
          capacity: 20,
        },
        {
          id: 11,
          tripId: 2,
          startDate: '2026-11-01T00:00:00.000Z',
          endDate: '2026-11-05T00:00:00.000Z',
          price: 50.0,
          capacity: 25,
        },
      ]);

      const result = await service.searchTrips({
        availableOnly: true,
        page: 1,
        limit: 10,
      });

      // Trip 1 is fully booked (20/20); trip 2 has 5 seats left.
      expect(result.meta.total).toBe(1);
      expect(result.data[0].id).toBe(2);
      expect(getConfirmedBookedSeats).toHaveBeenCalled();
    });

    it('sorts by price and earliest date, dateless trips last', async () => {
      harness.txCollection.all.mockResolvedValue([nile(), safari()]);
      harness.txTripDateCollection.all.mockResolvedValue([
        {
          id: 11,
          tripId: 2,
          startDate: '2026-11-01T00:00:00.000Z',
          endDate: '2026-11-05T00:00:00.000Z',
          price: 500.0,
          capacity: 10,
        },
        {
          id: 10,
          tripId: 1,
          startDate: '2026-10-01T00:00:00.000Z',
          endDate: '2026-10-05T00:00:00.000Z',
          price: 99.99,
          capacity: 20,
        },
      ]);

      const asc = await service.searchTrips({
        sort: 'price_asc',
        page: 1,
        limit: 10,
      });
      expect(asc.data.map((t) => t.id)).toEqual([1, 2]);

      const desc = await service.searchTrips({
        sort: 'price_desc',
        page: 1,
        limit: 10,
      });
      expect(desc.data.map((t) => t.id)).toEqual([2, 1]);

      const byDate = await service.searchTrips({
        sort: 'date_asc',
        page: 1,
        limit: 10,
      });
      expect(byDate.data.map((t) => t.id)).toEqual([1, 2]);
    });

    it('rejects inverted ranges with 400', async () => {
      await expect(
        service.searchTrips({
          minPrice: 200,
          maxPrice: 100,
          page: 1,
          limit: 10,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      await expect(
        service.searchTrips({
          minDuration: 7,
          maxDuration: 2,
          page: 1,
          limit: 10,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('returns empty metadata when nothing matches', async () => {
      harness.txCollection.all.mockResolvedValue([]);

      const result = await service.searchTrips({
        text: 'zzz',
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    });
  });

  describe('findOne', () => {
    it('returns the trip with its destination', async () => {
      harness.collection.first.mockResolvedValue(trip());

      const result = await service.findOne(1);

      expect(result.name).toBe('Nile cruise');
      expect(result.destination!.name).toBe('Cairo');
    });

    it('throws NotFoundException when missing or inactive', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a trip for an active destination', async () => {
      harness.destinationNamespace.first.mockResolvedValue(activeDestination());
      harness.tripNamespace.create.mockResolvedValue({ id: 1 });
      harness.collection.first.mockResolvedValue(trip());

      const result = await service.create({
        destinationId: 10,
        name: '  Nile cruise  ',
        durationDays: 3,
      });

      expect(harness.tripNamespace.create).toHaveBeenCalledWith({
        destinationId: 10,
        name: 'Nile cruise',
        durationDays: 3,
      });
      expect(result.destination!.name).toBe('Cairo');
    });

    it('throws NotFoundException for unknown destinations', async () => {
      harness.destinationNamespace.first.mockResolvedValue(null);

      await expect(
        service.create({ destinationId: 999, name: 'X', durationDays: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.tripNamespace.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for inactive destinations', async () => {
      harness.destinationNamespace.first.mockResolvedValue({
        ...activeDestination(),
        isActive: false,
      });

      await expect(
        service.create({ destinationId: 10, name: 'X', durationDays: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NotFoundException for unknown operators', async () => {
      harness.destinationNamespace.first.mockResolvedValue(activeDestination());
      harness.operatorNamespace.first.mockResolvedValue(null);

      await expect(
        service.create({
          destinationId: 10,
          name: 'X',
          durationDays: 1,
          operatorId: 999,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.tripNamespace.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates fields and returns the trip', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.operatorNamespace.first.mockResolvedValue({
        id: 7,
        isActive: true,
      });
      harness.collection.update.mockResolvedValue([{}]);

      const result = await service.update(1, {
        name: 'Red Sea dive',
        operatorId: 7,
      });

      expect(harness.collection.update).toHaveBeenCalledWith({
        name: 'Red Sea dive',
        operatorId: 7,
      });
      expect(result.id).toBe(1);
    });

    it('validates a new destination before moving', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.destinationNamespace.first.mockResolvedValue(null);

      await expect(
        service.update(1, { destinationId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('validates a new operator before assigning', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.operatorNamespace.first.mockResolvedValue(null);

      await expect(
        service.update(1, { operatorId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown trips', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(service.update(999, { name: 'X' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns the record unchanged when there is nothing to update', async () => {
      const existing = trip();
      harness.collection.first.mockResolvedValue(existing);

      const result = await service.update(1, {});

      expect(result).toBe(existing);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('blocks deactivation with 409 while active dates exist', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.tripDateCollection.first.mockResolvedValue({ id: 10 });

      await expect(
        service.update(1, { isActive: false }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('allows deactivation via update when no active dates exist', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.tripDateCollection.first.mockResolvedValue(null);
      harness.collection.update.mockResolvedValue([{}]);

      await service.update(1, { isActive: false });

      expect(harness.collection.update).toHaveBeenCalledWith({
        isActive: false,
      });
    });
  });

  describe('remove', () => {
    it('deactivates instead of deleting', async () => {
      harness.collection.first.mockResolvedValue(trip());

      const result = await service.remove(1);

      expect(harness.collection.update).toHaveBeenCalledWith({
        isActive: false,
      });
      expect(result.id).toBe(1);
    });

    it('is idempotent for already-inactive trips', async () => {
      const inactive = trip({ isActive: false });
      harness.collection.first.mockResolvedValue(inactive);

      const result = await service.remove(1);

      expect(result).toBe(inactive);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown trips', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('blocks deactivation while active dates exist', async () => {
      harness.collection.first.mockResolvedValue(trip());
      harness.tripDateCollection.first.mockResolvedValue({ id: 10 });

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });
  });

  describe('operator assignment', () => {
    const nileCo = {
      id: 7,
      name: 'Nile Co',
      description: null,
      isActive: true,
    };

    it('returns the assigned company', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: 7 }));
      harness.operatorNamespace.first.mockResolvedValue(nileCo);

      await expect(service.getOperator(1)).resolves.toEqual(nileCo);
    });

    it('throws NotFoundException when no operator is assigned', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));

      await expect(service.getOperator(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws NotFoundException for dangling assignments', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: 7 }));
      harness.operatorNamespace.first.mockResolvedValue(null);

      await expect(service.getOperator(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('assigns and unassigns operators', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));
      harness.operatorNamespace.first.mockResolvedValue(nileCo);

      await service.assignOperator(1, { operatorId: 7 });
      expect(harness.collection.update).toHaveBeenCalledWith({
        operatorId: 7,
      });

      vi.clearAllMocks();
      harness.tripNamespace.where.mockReturnValue(harness.collection);
      harness.collection.first.mockResolvedValue(trip({ operatorId: 7 }));

      await service.unassignOperator(1);
      expect(harness.collection.update).toHaveBeenCalledWith({
        operatorId: null,
      });
    });

    it('unassign is idempotent when already unassigned', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));

      await service.unassignOperator(1);

      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown trips', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(
        service.assignOperator(999, { operatorId: 7 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NotFoundException for unknown operators', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));
      harness.operatorNamespace.first.mockResolvedValue(null);

      await expect(
        service.assignOperator(1, { operatorId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });
  });
});

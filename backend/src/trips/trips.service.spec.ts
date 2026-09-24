import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
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
    return stub;
  };
  const collection = build();
  const txCollection = build();
  const tripNamespace = {
    where: vi.fn(() => collection),
    first: vi.fn(),
    create: vi.fn(),
  };
  const destinationNamespace = { first: vi.fn() };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDb = { orm: { public: { Trip: txNamespace } } };
  const db = {
    orm: {
      public: { Trip: tripNamespace, Destination: destinationNamespace },
    },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    tripNamespace,
    destinationNamespace,
    collection,
    txNamespace,
    txCollection,
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

  beforeEach(() => {
    vi.clearAllMocks();
    harness.tripNamespace.where.mockReturnValue(harness.collection);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    service = new TripsService();
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
  });

  describe('findOne', () => {
    it('returns the trip with its destination', async () => {
      harness.collection.first.mockResolvedValue(trip());

      const result = await service.findOne(1);

      expect(result.name).toBe('Nile cruise');
      expect(result.destination.name).toBe('Cairo');
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
      expect(result.destination.name).toBe('Cairo');
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
  });

  describe('update', () => {
    it('updates fields and returns the trip', async () => {
      harness.collection.first.mockResolvedValue(trip());
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
  });

  describe('operator assignment', () => {
    it('returns the assigned operator id', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: 7 }));

      await expect(service.getOperator(1)).resolves.toEqual({
        operatorId: 7,
      });
    });

    it('throws NotFoundException when no operator is assigned', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));

      await expect(service.getOperator(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('assigns and unassigns operators', async () => {
      harness.collection.first.mockResolvedValue(trip({ operatorId: null }));

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
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DestinationsService } from './destinations.service.js';
import type { Destination } from './destinations.service.js';

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
    };
    stub.where.mockReturnValue(stub);
    stub.orderBy.mockReturnValue(stub);
    stub.limit.mockReturnValue(stub);
    stub.offset.mockReturnValue(stub);
    return stub;
  };
  const collection = build();
  const txCollection = build();
  const tripCollection = build();
  const namespace = {
    where: vi.fn(() => collection),
    first: vi.fn(),
    create: vi.fn(),
  };
  const tripNamespace = { where: vi.fn(() => tripCollection) };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDb = { orm: { public: { Destination: txNamespace } } };
  const db = {
    orm: { public: { Destination: namespace, Trip: tripNamespace } },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    namespace,
    collection,
    tripNamespace,
    tripCollection,
    txNamespace,
    txCollection,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-23T00:00:00.000Z';

function destination(overrides: Partial<Destination> = {}): Destination {
  return {
    id: 1,
    name: 'Cairo',
    description: null,
    city: 'Cairo',
    country: 'Egypt',
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

describe('DestinationsService', () => {
  let service: DestinationsService;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.namespace.where.mockReturnValue(harness.collection);
    harness.tripNamespace.where.mockReturnValue(harness.tripCollection);
    harness.tripCollection.first.mockResolvedValue(null);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    service = new DestinationsService();
  });

  describe('findAll', () => {
    it('returns paginated data with metadata', async () => {
      const rows = [destination(), destination({ id: 2, name: 'Luxor' })];
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

    it('offsets later pages and reports zero pages when empty', async () => {
      harness.txCollection.all.mockResolvedValue([]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 0 });

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(harness.txCollection.offset).toHaveBeenCalledWith(20);
      expect(result.meta).toEqual({
        page: 3,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    });

    it('adds a name filter when search is provided', async () => {
      harness.txCollection.all.mockResolvedValue([]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 0 });

      await service.findAll({ page: 1, limit: 10, search: 'cai' });

      // Per query: one namespace .where() for the active-only filter, then
      // one chained collection .where() for the search filter.
      expect(harness.txNamespace.where).toHaveBeenCalledTimes(2);
      expect(harness.txCollection.where).toHaveBeenCalledTimes(2);
    });

    it('ignores blank search strings', async () => {
      harness.txCollection.all.mockResolvedValue([]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 0 });

      await service.findAll({ page: 1, limit: 10, search: '   ' });

      expect(harness.txNamespace.where).toHaveBeenCalledTimes(2);
      expect(harness.txCollection.where).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns the destination', async () => {
      harness.collection.first.mockResolvedValue(destination());

      const result = await service.findOne(1);

      expect(result.name).toBe('Cairo');
    });

    it('throws NotFoundException when missing or inactive', async () => {
      harness.collection.first.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates with trimmed values', async () => {
      harness.collection.first.mockResolvedValue(null);
      harness.namespace.create.mockResolvedValue(destination());

      const result = await service.create({
        name: '  Luxor  ',
        city: 'Luxor',
        country: 'Egypt',
      });

      expect(harness.namespace.create).toHaveBeenCalledWith({
        name: 'Luxor',
        city: 'Luxor',
        country: 'Egypt',
      });
      expect(result.name).toBe('Cairo');
    });

    it('throws ConflictException when the name is taken (any casing)', async () => {
      harness.collection.first.mockResolvedValue(destination());

      await expect(
        service.create({ name: 'cairo', city: 'Cairo', country: 'Egypt' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.namespace.create).not.toHaveBeenCalled();
    });

    it('maps a raced unique violation to ConflictException', async () => {
      harness.collection.first.mockResolvedValue(null);
      harness.namespace.create.mockRejectedValue({ sqlState: '23505' });

      await expect(
        service.create({ name: 'Cairo', city: 'Cairo', country: 'Egypt' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rethrows non-unique database errors', async () => {
      harness.collection.first.mockResolvedValue(null);
      const failure = new Error('connection lost');
      harness.namespace.create.mockRejectedValue(failure);

      await expect(
        service.create({ name: 'Cairo', city: 'Cairo', country: 'Egypt' }),
      ).rejects.toBe(failure);
    });
  });

  describe('update', () => {
    it('updates and returns the destination', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.collection.first.mockResolvedValue(null);
      harness.collection.update.mockResolvedValue([
        destination({ city: 'Giza' }),
      ]);

      const result = await service.update(1, { city: 'Giza' });

      expect(result.city).toBe('Giza');
      expect(harness.collection.update).toHaveBeenCalledWith({
        city: 'Giza',
      });
    });

    it('throws NotFoundException for unknown ids', async () => {
      harness.namespace.first.mockResolvedValue(null);

      await expect(
        service.update(999, { city: 'Giza' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws ConflictException when renaming to a taken name', async () => {
      harness.namespace.first.mockResolvedValue(destination({ id: 1 }));
      harness.collection.first.mockResolvedValue(destination({ id: 2 }));

      await expect(service.update(1, { name: 'Luxor' })).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('returns the record unchanged when there is nothing to update', async () => {
      const existing = destination();
      harness.namespace.first.mockResolvedValue(existing);

      const result = await service.update(1, {});

      expect(result).toBe(existing);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deactivates instead of deleting', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.collection.update.mockResolvedValue([
        destination({ isActive: false }),
      ]);

      const result = await service.remove(1);

      expect(harness.collection.update).toHaveBeenCalledWith({
        isActive: false,
      });
      expect(result.isActive).toBe(false);
    });

    it('is idempotent for already-inactive destinations', async () => {
      const inactive = destination({ isActive: false });
      harness.namespace.first.mockResolvedValue(inactive);

      const result = await service.remove(1);

      expect(result).toBe(inactive);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown ids', async () => {
      harness.namespace.first.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('blocks deactivation with 409 while active trips reference it', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.tripCollection.first.mockResolvedValue({ id: 5 });

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('deactivates when only inactive trips reference it', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.tripCollection.first.mockResolvedValue(null);
      harness.collection.update.mockResolvedValue([
        destination({ isActive: false }),
      ]);

      const result = await service.remove(1);

      expect(result.isActive).toBe(false);
    });
  });

  describe('deactivation guard on update', () => {
    it('blocks isActive: false with 409 while active trips reference it', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.tripCollection.first.mockResolvedValue({ id: 5 });

      await expect(
        service.update(1, { isActive: false }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('allows deactivation when no active trips reference it', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.tripCollection.first.mockResolvedValue(null);
      harness.collection.update.mockResolvedValue([
        destination({ isActive: false }),
      ]);

      const result = await service.update(1, { isActive: false });

      expect(result.isActive).toBe(false);
    });

    it('does not consult trips for non-deactivating updates', async () => {
      harness.namespace.first.mockResolvedValue(destination());
      harness.collection.first.mockResolvedValue(null);
      harness.collection.update.mockResolvedValue([
        destination({ city: 'Giza' }),
      ]);

      await service.update(1, { city: 'Giza' });

      expect(harness.tripNamespace.where).not.toHaveBeenCalled();
    });
  });
});

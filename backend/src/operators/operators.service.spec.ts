import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { OperatorsService } from './operators.service.js';

function buildCollection() {
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
}

const harness = vi.hoisted(() => {
  const collection = buildCollection();
  const txCollection = buildCollection();
  const namespace = {
    where: vi.fn(() => collection),
    first: vi.fn(),
    create: vi.fn(),
  };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDb = { orm: { public: { Operator: txNamespace } } };
  const db = {
    orm: { public: { Operator: namespace } },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return { db, namespace, collection, txNamespace, txCollection };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-24T00:00:00.000Z';

function operator(overrides = {}) {
  return {
    id: 1,
    name: 'Nile Adventures',
    description: null,
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

describe('OperatorsService', () => {
  let service: OperatorsService;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.namespace.where.mockReturnValue(harness.collection);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    service = new OperatorsService();
  });

  it('creates with trimmed values', async () => {
    harness.namespace.create.mockResolvedValue(operator());

    const result = await service.create({ name: '  Nile Adventures  ' });

    expect(harness.namespace.create).toHaveBeenCalledWith({
      name: 'Nile Adventures',
    });
    expect(result.name).toBe('Nile Adventures');
  });

  it('lists with metadata, active-only by default', async () => {
    harness.txCollection.all.mockResolvedValue([operator()]);
    harness.txCollection.aggregate.mockResolvedValue({ total: 4 });

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 4,
      totalPages: 1,
    });
  });

  it('finds inactive records for admin reads', async () => {
    harness.namespace.first.mockResolvedValue(operator({ isActive: false }));

    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);

    const result = await service.findOne(1, false);
    expect(result.isActive).toBe(false);
  });

  it('throws NotFoundException for unknown operators', async () => {
    harness.namespace.first.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.update(999, { name: 'X' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      service.setStatus(999, { isActive: false }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates and toggles status', async () => {
    harness.namespace.first.mockResolvedValue(operator());
    harness.collection.update.mockResolvedValueOnce([
      operator({ name: 'New' }),
    ]);

    const updated = await service.update(1, { name: 'New' });
    expect(updated.name).toBe('New');

    // No update mock left: setStatus falls back to the toggled snapshot.
    const toggled = await service.setStatus(1, { isActive: false });
    expect(toggled.isActive).toBe(false);
  });

  it('returns unchanged records for empty updates and same status', async () => {
    const existing = operator();
    harness.namespace.first.mockResolvedValue(existing);

    await expect(service.update(1, {})).resolves.toBe(existing);
    expect(harness.collection.update).not.toHaveBeenCalled();

    await expect(service.setStatus(1, { isActive: true })).resolves.toBe(
      existing,
    );
  });
});

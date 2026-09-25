import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';

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
  const userNamespace = { where: vi.fn(() => collection), first: vi.fn() };
  const operatorNamespace = { first: vi.fn() };
  const txNamespace = { where: vi.fn(() => txCollection) };
  const txDb = { orm: { public: { User: txNamespace } } };
  const db = {
    orm: {
      public: { User: userNamespace, Operator: operatorNamespace },
    },
    transaction: vi.fn((cb) => cb(txDb)),
  };
  return {
    db,
    userNamespace,
    operatorNamespace,
    collection,
    txNamespace,
    txCollection,
  };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

const STAMP = '2026-09-24T00:00:00.000Z';
const requester = { id: 99, role: 'Admin' } as never;

function user(overrides = {}) {
  return {
    id: 1,
    email: 'sara@example.com',
    passwordHash: 'hash',
    username: null,
    name: 'Sara',
    role: 'customer',
    operatorId: null,
    emailVerifiedAt: null,
    isActive: true,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...overrides,
  };
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    vi.clearAllMocks();
    harness.userNamespace.where.mockReturnValue(harness.collection);
    harness.txNamespace.where.mockReturnValue(harness.txCollection);
    service = new UsersService();
  });

  describe('getProfile / updateProfile', () => {
    it('returns the profile', async () => {
      harness.userNamespace.first.mockResolvedValue(user());

      const result = await service.getProfile(1);

      expect(result.role).toBe('Customer');
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('throws NotFoundException for missing or inactive users', async () => {
      harness.userNamespace.first.mockResolvedValue(null);
      await expect(service.getProfile(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      harness.userNamespace.first.mockResolvedValue(user({ isActive: false }));
      await expect(service.getProfile(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('updates profile fields', async () => {
      harness.userNamespace.first.mockResolvedValue(user({ name: 'S' }));

      const result = await service.updateProfile(1, { name: 'S' });

      expect(harness.collection.update).toHaveBeenCalledWith({ name: 'S' });
      expect(result.name).toBe('S');
    });
  });

  describe('findAll / findOne', () => {
    it('lists with metadata and search', async () => {
      harness.txCollection.all.mockResolvedValue([user()]);
      harness.txCollection.aggregate.mockResolvedValue({ total: 7 });

      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'sa',
      });

      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 7,
        totalPages: 1,
      });
    });

    it('finds by id regardless of status', async () => {
      harness.userNamespace.first.mockResolvedValue(user({ isActive: false }));

      const result = await service.findOne(1);

      expect(result.isActive).toBe(false);
    });

    it('throws NotFoundException for unknown ids', async () => {
      harness.userNamespace.first.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('updates fields and validates operator linkage', async () => {
      harness.userNamespace.first
        .mockResolvedValueOnce(user())
        .mockResolvedValueOnce(user({ role: 'operator', operatorId: 3 }));
      harness.operatorNamespace.first.mockResolvedValue({
        id: 3,
        isActive: true,
      });

      const result = await service.updateUser(
        1,
        { role: 'Operator', operatorId: 3 },
        requester,
      );

      expect(harness.collection.update).toHaveBeenCalledWith({
        role: 'operator',
        operatorId: 3,
      });
      expect(result.role).toBe('Operator');
    });

    it('rejects operatorId without the Operator role', async () => {
      harness.userNamespace.first.mockResolvedValue(user());

      await expect(
        service.updateUser(1, { operatorId: 3 }, requester),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('rejects unknown or inactive operators', async () => {
      harness.userNamespace.first.mockResolvedValue(user());
      harness.operatorNamespace.first.mockResolvedValue(null);

      await expect(
        service.updateUser(1, { role: 'Operator', operatorId: 999 }, requester),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('forbids self role changes', async () => {
      harness.userNamespace.first.mockResolvedValue(
        user({ id: 99, role: 'admin' }),
      );

      await expect(
        service.updateUser(99, { role: 'Customer' }, requester),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown users', async () => {
      harness.userNamespace.first.mockResolvedValue(null);

      await expect(
        service.updateUser(999, { name: 'X' }, requester),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('setStatus', () => {
    it('toggles active state', async () => {
      harness.userNamespace.first.mockResolvedValue(user());

      const result = await service.setStatus(1, { isActive: false }, requester);

      expect(harness.collection.update).toHaveBeenCalledWith({
        isActive: false,
      });
      expect(result.id).toBe(1);
    });

    it('forbids self deactivation', async () => {
      harness.userNamespace.first.mockResolvedValue(
        user({ id: 99, role: 'admin' }),
      );

      await expect(
        service.setStatus(99, { isActive: false }, requester),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(harness.collection.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for unknown users', async () => {
      harness.userNamespace.first.mockResolvedValue(null);

      await expect(
        service.setStatus(999, { isActive: false }, requester),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

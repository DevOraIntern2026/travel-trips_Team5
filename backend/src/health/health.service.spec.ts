import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthService } from './health.service.js';

const harness = vi.hoisted(() => {
  const aggregate = vi.fn();
  const users = { aggregate };
  const db = { orm: { public: { User: users } } };
  return { db, users, aggregate };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new HealthService();
  });

  it('reports up when the database answers', async () => {
    harness.aggregate.mockResolvedValue({ total: 3 });

    await expect(service.checkDatabase()).resolves.toBe('up');
    await expect(service.readiness()).resolves.toEqual({
      status: 'ok',
      database: 'up',
      timestamp: expect.any(String),
    });
  });

  it('reports down instead of throwing when the database fails', async () => {
    harness.aggregate.mockRejectedValue(new Error('connection lost'));

    await expect(service.checkDatabase()).resolves.toBe('down');
    await expect(service.readiness()).resolves.toMatchObject({
      status: 'error',
      database: 'down',
    });
  });
});

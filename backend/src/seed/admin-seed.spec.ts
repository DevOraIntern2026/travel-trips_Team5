import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedAdmin } from './admin-seed.js';

function buildCollection() {
  const stub = {
    where: vi.fn(),
    first: vi.fn(),
    create: vi.fn(),
  };
  stub.where.mockReturnValue(stub);
  return stub;
}

const harness = vi.hoisted(() => {
  const users = buildCollection();
  const db = {
    orm: { public: { User: { where: vi.fn(() => users), create: vi.fn() } } },
  };
  return { db, users };
});

vi.mock('../prisma/db.js', () => ({ db: harness.db }));

describe('seedAdmin', () => {
  const passwords = { hash: vi.fn(async (p: string) => `hash:${p}`) };

  beforeEach(() => {
    vi.clearAllMocks();
    harness.db.orm.public.User.where.mockReturnValue(harness.users);
  });

  it('creates an admin with a hashed password', async () => {
    harness.users.first.mockResolvedValue(null);
    harness.db.orm.public.User.create.mockResolvedValue({ id: 1 });

    const result = await seedAdmin(
      { email: 'Admin@Example.com', password: 'pw' },
      { passwords: passwords as never },
    );

    expect(result).toEqual({ status: 'created', id: 1 });
    expect(harness.db.orm.public.User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'admin@example.com',
        passwordHash: 'hash:pw',
        role: 'admin',
      }),
    );
  });

  it('leaves an existing admin untouched', async () => {
    harness.users.first.mockResolvedValue({ id: 7 });

    const result = await seedAdmin(
      { email: 'admin@example.com', password: 'pw' },
      { passwords: passwords as never },
    );

    expect(result).toEqual({ status: 'exists', id: 7 });
    expect(harness.db.orm.public.User.create).not.toHaveBeenCalled();
  });

  it('throws when credentials are missing', async () => {
    await expect(seedAdmin({ email: '', password: '' })).rejects.toThrow(
      'ADMIN_EMAIL and ADMIN_PASSWORD must both be set',
    );
  });
});

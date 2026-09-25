import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { db } from './../src/prisma/db.js';
import { adminHeader, authHeaderFor } from './helpers/auth.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';

describe('Users & Operators (e2e)', () => {
  let app: INestApplication<App>;
  let adminAuth: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearAllTables();
    adminAuth = await adminHeader();
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  // Direct-minted tokens (1 hash, no login round-trips). Real login flows
  // live in auth.e2e-spec.ts; the deactivate test below uses a real login
  // because it asserts on login behavior itself.
  async function customerAuth(email = 'sara@example.com'): Promise<string> {
    return authHeaderFor({ email });
  }

  async function createCompany(name = 'Nile Adventures') {
    const res = await request(app.getHttpServer())
      .post('/api/v1/operators')
      .set('Authorization', adminAuth)
      .send({ name })
      .expect(201);
    return res.body.id as number;
  }

  it('GET /api/v1/users/me returns the profile', async () => {
    await customerAuth();

    const customer = await customerAuth('me@example.com');
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', customer)
      .expect(200);
    expect(res.body.email).toBe('me@example.com');
    expect(res.body.role).toBe('Customer');
    expect(res.body).not.toHaveProperty('passwordHash');

    await request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
  });

  it('PUT /api/v1/users/me updates the profile', async () => {
    const customer = await customerAuth();

    const res = await request(app.getHttpServer())
      .put('/api/v1/users/me')
      .set('Authorization', customer)
      .send({ name: 'Sara Travels' })
      .expect(200);
    expect(res.body.name).toBe('Sara Travels');
  });

  it('GET /api/v1/users is Admin-only and sees all statuses', async () => {
    await customerAuth();
    const customer = await customerAuth('c2@example.com');

    await request(app.getHttpServer()).get('/api/v1/users').expect(401);

    await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', customer)
      .expect(403);

    // Deactivate one user straight in the DB, then list as admin.
    const target = await db.orm.public.User.where((u) =>
      u.email.eq('sara@example.com'),
    ).first();
    await db.orm.public.User.where({ id: target!.id }).update({
      isActive: false,
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(res.body.meta.total).toBe(3);
  });

  it('Admin promotes a customer to operator of a company', async () => {
    await customerAuth();
    const companyId = await createCompany();
    const target = await db.orm.public.User.where((u) =>
      u.email.eq('sara@example.com'),
    ).first();

    // operatorId without the Operator role is rejected.
    await request(app.getHttpServer())
      .put(`/api/v1/users/${target!.id}`)
      .set('Authorization', adminAuth)
      .send({ operatorId: companyId })
      .expect(400);

    // Unknown companies are rejected.
    await request(app.getHttpServer())
      .put(`/api/v1/users/${target!.id}`)
      .set('Authorization', adminAuth)
      .send({ role: 'Operator', operatorId: 999999 })
      .expect(404);

    const promoted = await request(app.getHttpServer())
      .put(`/api/v1/users/${target!.id}`)
      .set('Authorization', adminAuth)
      .send({ role: 'Operator', operatorId: companyId })
      .expect(200);
    expect(promoted.body.role).toBe('Operator');
    expect(promoted.body.operatorId).toBe(companyId);

    await request(app.getHttpServer())
      .get(`/api/v1/users/${target!.id}`)
      .set('Authorization', adminAuth)
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/users/999999')
      .set('Authorization', adminAuth)
      .expect(404);
  });

  it('Admins cannot change their own role or status', async () => {
    const me = await db.orm.public.User.where((u) =>
      u.email.eq('admin@example.com'),
    ).first();

    await request(app.getHttpServer())
      .put(`/api/v1/users/${me!.id}`)
      .set('Authorization', adminAuth)
      .send({ role: 'Customer' })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/api/v1/users/${me!.id}/status`)
      .set('Authorization', adminAuth)
      .send({ isActive: false })
      .expect(403);
  });

  it('PATCH /api/v1/users/:id/status deactivates, login then fails', async () => {
    await authHeaderFor({ email: 'sara@example.com' }, 'S3cure-p@ssphrase');
    const target = await db.orm.public.User.where((u) =>
      u.email.eq('sara@example.com'),
    ).first();

    await request(app.getHttpServer())
      .patch(`/api/v1/users/${target!.id}/status`)
      .set('Authorization', adminAuth)
      .send({ isActive: false })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'sara@example.com', password: 'S3cure-p@ssphrase' })
      .expect(401);
  });

  it('operators are publicly listed but managed by Admin', async () => {
    const id = await createCompany('Nile Adventures');
    await db.orm.public.Operator.create({
      name: 'Hidden Gems',
      isActive: false,
    });

    const list = await request(app.getHttpServer())
      .get('/api/v1/operators')
      .expect(200);
    expect(list.body.meta.total).toBe(1);

    await request(app.getHttpServer())
      .get(`/api/v1/operators/${id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/operators/999999')
      .expect(404);

    // Management requires Admin.
    await request(app.getHttpServer())
      .post('/api/v1/operators')
      .send({ name: 'X' })
      .expect(401);

    const customer = await customerAuth();
    await request(app.getHttpServer())
      .post('/api/v1/operators')
      .set('Authorization', customer)
      .send({ name: 'X' })
      .expect(403);

    await request(app.getHttpServer())
      .post('/api/v1/operators')
      .set('Authorization', adminAuth)
      .send({ name: '  ' })
      .expect(400);
  });

  it('PUT + PATCH manage operators, admin routes mirror', async () => {
    const id = await createCompany('Nile Adventures');

    const updated = await request(app.getHttpServer())
      .put(`/api/v1/operators/${id}`)
      .set('Authorization', adminAuth)
      .send({ description: 'Sail the Nile' })
      .expect(200);
    expect(updated.body.description).toBe('Sail the Nile');

    await request(app.getHttpServer())
      .put('/api/v1/operators/999999')
      .set('Authorization', adminAuth)
      .send({ name: 'X' })
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/v1/operators/${id}/status`)
      .set('Authorization', adminAuth)
      .send({ isActive: false })
      .expect(200);

    // Gone from the public list, visible to admins.
    const list = await request(app.getHttpServer())
      .get('/api/v1/operators')
      .expect(200);
    expect(list.body.meta.total).toBe(0);

    const adminList = await request(app.getHttpServer())
      .get('/api/v1/admin/operators')
      .set('Authorization', adminAuth)
      .expect(200);
    expect(adminList.body.meta.total).toBe(1);

    await request(app.getHttpServer())
      .get(`/api/v1/admin/operators/${id}`)
      .set('Authorization', adminAuth)
      .expect(200);

    const revived = await request(app.getHttpServer())
      .patch(`/api/v1/admin/operators/${id}/status`)
      .set('Authorization', adminAuth)
      .send({ isActive: true })
      .expect(200);
    expect(revived.body.isActive).toBe(true);

    await request(app.getHttpServer())
      .get('/api/v1/admin/operators')
      .expect(401);
  });
});

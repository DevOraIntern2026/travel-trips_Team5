import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { db } from './../src/prisma/db.js';
import { adminHeader } from './helpers/auth.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';

describe('Destinations (e2e)', () => {
  let app: INestApplication<App>;
  let adminAuth: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearAllTables();
    adminAuth = await adminHeader(app);
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  const createPayload = (overrides = {}) => ({
    name: 'Cairo',
    city: 'Cairo',
    country: 'Egypt',
    ...overrides,
  });

  it('GET /api/v1/destinations returns paginated data with meta', async () => {
    await db.orm.public.Destination.create(createPayload());
    await db.orm.public.Destination.create(
      createPayload({ name: 'Luxor', city: 'Luxor' }),
    );
    await db.orm.public.Destination.create(
      createPayload({ name: 'Aswan', city: 'Aswan' }),
    );

    const res = await request(app.getHttpServer())
      .get('/api/v1/destinations?page=1&limit=2')
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
  });

  it('GET /api/v1/destinations searches by name (case-insensitive)', async () => {
    await db.orm.public.Destination.create(createPayload());
    await db.orm.public.Destination.create(
      createPayload({ name: 'Luxor', city: 'Luxor' }),
    );

    const res = await request(app.getHttpServer())
      .get('/api/v1/destinations?search=CAI')
      .expect(200);

    expect(res.body.meta.total).toBe(1);
    expect(res.body.data[0].name).toBe('Cairo');
  });

  it('GET /api/v1/destinations hides inactive records', async () => {
    const created = await db.orm.public.Destination.create(createPayload());
    await db.orm.public.Destination.where({ id: created.id }).update({
      isActive: false,
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/destinations')
      .expect(200);

    expect(res.body.meta.total).toBe(0);
    expect(res.body.data).toEqual([]);
  });

  it('GET /api/v1/destinations/:id returns details, 404 when missing or inactive', async () => {
    const created = await db.orm.public.Destination.create(createPayload());

    const res = await request(app.getHttpServer())
      .get(`/api/v1/destinations/${created.id}`)
      .expect(200);
    expect(res.body.name).toBe('Cairo');
    expect(res.body.isActive).toBe(true);

    await request(app.getHttpServer())
      .get('/api/v1/destinations/999999')
      .expect(404);

    await db.orm.public.Destination.where({ id: created.id }).update({
      isActive: false,
    });
    await request(app.getHttpServer())
      .get(`/api/v1/destinations/${created.id}`)
      .expect(404);
  });

  it('POST /api/v1/destinations creates a destination', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', adminAuth)
      .send(createPayload({ description: 'Nile city' }))
      .expect(201);

    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.name).toBe('Cairo');
    expect(res.body.isActive).toBe(true);
  });

  it('POST /api/v1/destinations rejects invalid bodies with 400', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', adminAuth)
      .send({ city: 'Cairo', country: 'Egypt' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', adminAuth)
      .send({ name: '   ', city: 'Cairo', country: 'Egypt' })
      .expect(400);
  });

  it('POST /api/v1/destinations rejects duplicate names (any casing) with 409', async () => {
    await db.orm.public.Destination.create(createPayload());

    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', adminAuth)
      .send(createPayload({ name: 'cAiRo' }))
      .expect(409);
  });

  it('PUT /api/v1/destinations/:id updates, 404s when missing, 409s on duplicates', async () => {
    const created = await db.orm.public.Destination.create(createPayload());
    await db.orm.public.Destination.create(
      createPayload({ name: 'Luxor', city: 'Luxor' }),
    );

    const updated = await request(app.getHttpServer())
      .put(`/api/v1/destinations/${created.id}`)
      .set('Authorization', adminAuth)
      .send({ city: 'Giza' })
      .expect(200);
    expect(updated.body.city).toBe('Giza');

    await request(app.getHttpServer())
      .put('/api/v1/destinations/999999')
      .set('Authorization', adminAuth)
      .send({ city: 'Giza' })
      .expect(404);

    await request(app.getHttpServer())
      .put(`/api/v1/destinations/${created.id}`)
      .set('Authorization', adminAuth)
      .send({ name: 'luxor' })
      .expect(409);
  });

  it('PUT /api/v1/destinations/:id can reactivate', async () => {
    const created = await db.orm.public.Destination.create(createPayload());
    await db.orm.public.Destination.where({ id: created.id }).update({
      isActive: false,
    });

    const res = await request(app.getHttpServer())
      .put(`/api/v1/destinations/${created.id}`)
      .set('Authorization', adminAuth)
      .send({ isActive: true })
      .expect(200);
    expect(res.body.isActive).toBe(true);

    await request(app.getHttpServer())
      .get(`/api/v1/destinations/${created.id}`)
      .expect(200);
  });

  it('DELETE /api/v1/destinations/:id deactivates (idempotent), 404s when missing', async () => {
    const created = await db.orm.public.Destination.create(createPayload());

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/destinations/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(200);
    expect(res.body.isActive).toBe(false);

    // Gone from public access but the row still exists.
    await request(app.getHttpServer())
      .get(`/api/v1/destinations/${created.id}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/v1/destinations/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(200);

    await request(app.getHttpServer())
      .delete('/api/v1/destinations/999999')
      .set('Authorization', adminAuth)
      .expect(404);
  });

  it('rejects non-numeric ids with 400', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/destinations/abc')
      .expect(400);
  });
});

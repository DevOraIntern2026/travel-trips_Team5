import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { db } from './../src/prisma/db.js';
import { adminHeader } from './helpers/auth.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';

describe('Trips (e2e)', () => {
  let app: INestApplication<App>;
  let adminAuth: string;
  let destinationId: number;
  let inactiveDestinationId: number;
  let companyId: number;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearAllTables();
    adminAuth = await adminHeader();
    const destination = await db.orm.public.Destination.create({
      name: 'Cairo',
      city: 'Cairo',
      country: 'Egypt',
    });
    destinationId = destination.id;
    const inactive = await db.orm.public.Destination.create({
      name: 'Giza',
      city: 'Giza',
      country: 'Egypt',
    });
    await db.orm.public.Destination.where({ id: inactive.id }).update({
      isActive: false,
    });
    inactiveDestinationId = inactive.id;
    companyId = (await db.orm.public.Operator.create({ name: 'Nile Co' })).id;
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  const createPayload = (overrides = {}) => ({
    destinationId,
    name: 'Nile cruise',
    durationDays: 3,
    ...overrides,
  });

  it('GET /api/v1/trips returns paginated data with meta', async () => {
    await db.orm.public.Trip.create(createPayload());
    await db.orm.public.Trip.create(createPayload({ name: 'Desert safari' }));
    await db.orm.public.Trip.create(createPayload({ name: 'Red Sea dive' }));

    const res = await request(app.getHttpServer())
      .get('/api/v1/trips?page=1&limit=2')
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
  });

  it('GET /api/v1/trips filters by search and destination', async () => {
    await db.orm.public.Trip.create(createPayload());
    await db.orm.public.Trip.create(createPayload({ name: 'Desert safari' }));

    const search = await request(app.getHttpServer())
      .get('/api/v1/trips?search=NILE')
      .expect(200);
    expect(search.body.meta.total).toBe(1);

    const filtered = await request(app.getHttpServer())
      .get(`/api/v1/trips?destinationId=${destinationId}`)
      .expect(200);
    expect(filtered.body.meta.total).toBe(2);

    const missing = await request(app.getHttpServer())
      .get('/api/v1/trips?destinationId=999999')
      .expect(200);
    expect(missing.body.meta.total).toBe(0);
  });

  it('GET /api/v1/trips hides inactive trips', async () => {
    const created = await db.orm.public.Trip.create(createPayload());
    await db.orm.public.Trip.where({ id: created.id }).update({
      isActive: false,
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/trips')
      .expect(200);

    expect(res.body.meta.total).toBe(0);
  });

  it('GET /api/v1/trips/:id returns details with destination', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${created.id}`)
      .expect(200);
    expect(res.body.name).toBe('Nile cruise');
    expect(res.body.destination.name).toBe('Cairo');

    await request(app.getHttpServer()).get('/api/v1/trips/999999').expect(404);
  });

  it('POST /api/v1/trips creates a trip', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send(
        createPayload({ operatorId: companyId, description: 'Sail the Nile' }),
      )
      .expect(201);

    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.operatorId).toBe(companyId);
    expect(res.body.destination.id).toBe(destinationId);
  });

  it('POST /api/v1/trips rejects unknown operators', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send(createPayload({ operatorId: 999999 }))
      .expect(404);
  });

  it('POST /api/v1/trips validates input', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send({ name: 'Nile cruise', durationDays: 3 })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send(createPayload({ durationDays: 0 }))
      .expect(400);
  });

  it('POST /api/v1/trips rejects unknown or inactive destinations', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send(createPayload({ destinationId: 999999 }))
      .expect(404);

    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', adminAuth)
      .send(createPayload({ destinationId: inactiveDestinationId }))
      .expect(404);
  });

  it('PUT /api/v1/trips/:id updates, moves and deactivates', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const updated = await request(app.getHttpServer())
      .put(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .send({ name: 'Red Sea dive', durationDays: 5 })
      .expect(200);
    expect(updated.body.name).toBe('Red Sea dive');

    await request(app.getHttpServer())
      .put(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .send({ destinationId: inactiveDestinationId })
      .expect(404);

    await request(app.getHttpServer())
      .put('/api/v1/trips/999999')
      .set('Authorization', adminAuth)
      .send({ name: 'X' })
      .expect(404);
  });

  it('DELETE /api/v1/trips/:id deactivates (idempotent)', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(200);
    expect(res.body.isActive).toBe(false);

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${created.id}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(200);

    await request(app.getHttpServer())
      .delete('/api/v1/trips/999999')
      .set('Authorization', adminAuth)
      .expect(404);
  });

  it('DELETE /api/v1/trips/:id is blocked while active dates exist', async () => {
    const created = await db.orm.public.Trip.create(createPayload());
    const date = await db.orm.public.TripDate.create({
      tripId: created.id,
      startDate: '2026-10-01T10:00:00.000Z',
      endDate: '2026-10-05T18:00:00.000Z',
      price: '99.99',
      capacity: 20,
    });

    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(409);

    // After deactivating the date, the trip can go.
    await db.orm.public.TripDate.where({ id: date.id }).update({
      isActive: false,
    });
    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .set('Authorization', adminAuth)
      .expect(200);
  });

  it('GET /api/v1/trips/:id/operator reports the assignment', async () => {
    const created = await db.orm.public.Trip.create(
      createPayload({ operatorId: companyId }),
    );
    const unassigned = await db.orm.public.Trip.create(
      createPayload({ name: 'Desert safari' }),
    );

    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${created.id}/operator`)
      .expect(200);
    expect(res.body).toEqual({
      id: companyId,
      name: 'Nile Co',
      description: null,
      isActive: true,
    });

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${unassigned.id}/operator`)
      .expect(404);

    await request(app.getHttpServer())
      .get('/api/v1/trips/999999/operator')
      .expect(404);
  });

  it('PATCH + DELETE /api/v1/admin/trips/:id/operator manage assignment', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const assigned = await request(app.getHttpServer())
      .patch(`/api/v1/admin/trips/${created.id}/operator`)
      .set('Authorization', adminAuth)
      .send({ operatorId: companyId })
      .expect(200);
    expect(assigned.body.operatorId).toBe(companyId);

    await request(app.getHttpServer())
      .patch('/api/v1/admin/trips/999999/operator')
      .set('Authorization', adminAuth)
      .send({ operatorId: companyId })
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/trips/${created.id}/operator`)
      .set('Authorization', adminAuth)
      .send({})
      .expect(400);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/trips/${created.id}/operator`)
      .set('Authorization', adminAuth)
      .send({ operatorId: 999999 })
      .expect(404);

    const unassigned = await request(app.getHttpServer())
      .delete(`/api/v1/admin/trips/${created.id}/operator`)
      .set('Authorization', adminAuth)
      .expect(200);
    expect(unassigned.body.operatorId).toBeNull();

    // Idempotent second unassign.
    await request(app.getHttpServer())
      .delete(`/api/v1/admin/trips/${created.id}/operator`)
      .set('Authorization', adminAuth)
      .expect(200);
  });

  it('GET /api/v1/operators/:id/trips lists assigned trips', async () => {
    await db.orm.public.Trip.create(createPayload({ operatorId: companyId }));
    await db.orm.public.Trip.create(
      createPayload({ name: 'Desert safari', operatorId: companyId }),
    );
    await db.orm.public.Trip.create(createPayload({ name: 'Red Sea dive' }));

    const res = await request(app.getHttpServer())
      .get(`/api/v1/operators/${companyId}/trips`)
      .expect(200);
    expect(res.body.meta.total).toBe(2);

    const empty = await request(app.getHttpServer())
      .get('/api/v1/operators/999999/trips')
      .expect(200);
    expect(empty.body.meta.total).toBe(0);

    await request(app.getHttpServer())
      .get('/api/v1/operators/abc/trips')
      .expect(400);
  });

  it('rejects non-numeric trip ids with 400', async () => {
    await request(app.getHttpServer()).get('/api/v1/trips/abc').expect(400);
  });

  it('GET /api/v1/trips/search matches names and destinations', async () => {
    const luxor = await db.orm.public.Destination.create({
      name: 'Luxor',
      city: 'Luxor',
      country: 'Egypt',
    });
    await db.orm.public.Trip.create(createPayload({ name: 'Nile cruise' }));
    await db.orm.public.Trip.create(
      createPayload({ name: 'Desert safari', destinationId: luxor.id }),
    );

    const byName = await request(app.getHttpServer())
      .get('/api/v1/trips/search?q=nile')
      .expect(200);
    expect(byName.body.meta.total).toBe(1);
    expect(byName.body.data[0].name).toBe('Nile cruise');

    const byDestination = await request(app.getHttpServer())
      .get('/api/v1/trips/search?q=luxor')
      .expect(200);
    expect(byDestination.body.meta.total).toBe(1);

    const none = await request(app.getHttpServer())
      .get('/api/v1/trips/search?q=zzz-no-match')
      .expect(200);
    expect(none.body.meta.total).toBe(0);

    await request(app.getHttpServer()).get('/api/v1/trips/search').expect(400);
  });

  it('GET /api/v1/trips/filter applies criteria', async () => {
    const t1 = await db.orm.public.Trip.create(
      createPayload({ name: 'Nile cruise', durationDays: 3 }),
    );
    await db.orm.public.TripDate.create({
      tripId: t1.id,
      startDate: '2026-10-01T10:00:00.000Z',
      endDate: '2026-10-05T18:00:00.000Z',
      price: '99.99',
      capacity: 20,
    });
    const t2 = await db.orm.public.Trip.create(
      createPayload({ name: 'Red Sea dive', durationDays: 7 }),
    );
    await db.orm.public.TripDate.create({
      tripId: t2.id,
      startDate: '2026-11-01T10:00:00.000Z',
      endDate: '2026-11-05T18:00:00.000Z',
      price: '500',
      capacity: 10,
    });
    await db.orm.public.Trip.create(createPayload({ name: 'Dateless wander' }));

    const byDestination = await request(app.getHttpServer())
      .get(`/api/v1/trips/filter?destinationId=${destinationId}`)
      .expect(200);
    expect(byDestination.body.meta.total).toBe(3);

    const byDate = await request(app.getHttpServer())
      .get('/api/v1/trips/filter?date=2026-10-03')
      .expect(200);
    expect(byDate.body.meta.total).toBe(1);
    expect(byDate.body.data[0].id).toBe(t1.id);

    const byPrice = await request(app.getHttpServer())
      .get('/api/v1/trips/filter?minPrice=100&maxPrice=600')
      .expect(200);
    expect(byPrice.body.meta.total).toBe(1);
    expect(byPrice.body.data[0].id).toBe(t2.id);

    const byDuration = await request(app.getHttpServer())
      .get('/api/v1/trips/filter?minDuration=5&maxDuration=10')
      .expect(200);
    expect(byDuration.body.meta.total).toBe(1);

    // Noop provider reports 0 booked: every dated trip is bookable, the
    // dateless one is not.
    const available = await request(app.getHttpServer())
      .get('/api/v1/trips/filter?availableOnly=true')
      .expect(200);
    expect(available.body.meta.total).toBe(2);

    await request(app.getHttpServer())
      .get('/api/v1/trips/filter?minPrice=200&maxPrice=100')
      .expect(400);
  });

  it('GET /api/v1/trips sorts by price and date', async () => {
    const cheap = await db.orm.public.Trip.create(
      createPayload({ name: 'Nile cruise' }),
    );
    await db.orm.public.TripDate.create({
      tripId: cheap.id,
      startDate: '2026-10-01T10:00:00.000Z',
      endDate: '2026-10-05T18:00:00.000Z',
      price: '99.99',
      capacity: 20,
    });
    const pricey = await db.orm.public.Trip.create(
      createPayload({ name: 'Red Sea dive' }),
    );
    await db.orm.public.TripDate.create({
      tripId: pricey.id,
      startDate: '2026-09-01T10:00:00.000Z',
      endDate: '2026-09-05T18:00:00.000Z',
      price: '500',
      capacity: 10,
    });
    await db.orm.public.Trip.create(createPayload({ name: 'Dateless wander' }));

    const asc = await request(app.getHttpServer())
      .get('/api/v1/trips?sort=price_asc')
      .expect(200);
    expect(asc.body.data.map((t: any) => t.name)).toEqual([
      'Nile cruise',
      'Red Sea dive',
      'Dateless wander',
    ]);

    const desc = await request(app.getHttpServer())
      .get('/api/v1/trips?sort=price_desc')
      .expect(200);
    expect(desc.body.data.map((t: any) => t.name)).toEqual([
      'Red Sea dive',
      'Nile cruise',
      'Dateless wander',
    ]);

    const byDate = await request(app.getHttpServer())
      .get('/api/v1/trips?sort=date_asc')
      .expect(200);
    expect(byDate.body.data.map((t: any) => t.name)).toEqual([
      'Red Sea dive',
      'Nile cruise',
      'Dateless wander',
    ]);

    await request(app.getHttpServer())
      .get('/api/v1/trips?sort=popularity')
      .expect(400);
  });
});

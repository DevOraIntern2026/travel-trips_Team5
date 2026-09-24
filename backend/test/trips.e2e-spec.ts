import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { db } from './../src/prisma/db.js';

async function clearTable(table: 'trip' | 'destination', iterations = 1000) {
  // The ORM .delete() removes a single matching row per call.
  for (let i = 0; i < iterations; i++) {
    const deleted =
      table === 'trip'
        ? await db.orm.public.Trip.where((t) => t.id.gte(0)).delete()
        : await db.orm.public.Destination.where((d) => d.id.gte(0)).delete();
    if (!deleted || (Array.isArray(deleted) && deleted.length === 0)) {
      return;
    }
  }
  throw new Error(`clearTable(${table}) did not converge`);
}

async function clearAll() {
  // Trips first: the FK points at destinations.
  await clearTable('trip');
  await clearTable('destination');
}

describe('Trips (e2e)', () => {
  let app: INestApplication<App>;
  let destinationId: number;
  let inactiveDestinationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await clearAll();
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
      .send(createPayload({ operatorId: 7, description: 'Sail the Nile' }))
      .expect(201);

    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.operatorId).toBe(7);
    expect(res.body.destination.id).toBe(destinationId);
  });

  it('POST /api/v1/trips validates input', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .send({ name: 'Nile cruise', durationDays: 3 })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .send(createPayload({ durationDays: 0 }))
      .expect(400);
  });

  it('POST /api/v1/trips rejects unknown or inactive destinations', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .send(createPayload({ destinationId: 999999 }))
      .expect(404);

    await request(app.getHttpServer())
      .post('/api/v1/trips')
      .send(createPayload({ destinationId: inactiveDestinationId }))
      .expect(404);
  });

  it('PUT /api/v1/trips/:id updates, moves and deactivates', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const updated = await request(app.getHttpServer())
      .put(`/api/v1/trips/${created.id}`)
      .send({ name: 'Red Sea dive', durationDays: 5 })
      .expect(200);
    expect(updated.body.name).toBe('Red Sea dive');

    await request(app.getHttpServer())
      .put(`/api/v1/trips/${created.id}`)
      .send({ destinationId: inactiveDestinationId })
      .expect(404);

    await request(app.getHttpServer())
      .put('/api/v1/trips/999999')
      .send({ name: 'X' })
      .expect(404);
  });

  it('DELETE /api/v1/trips/:id deactivates (idempotent)', async () => {
    const created = await db.orm.public.Trip.create(createPayload());

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .expect(200);
    expect(res.body.isActive).toBe(false);

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${created.id}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${created.id}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete('/api/v1/trips/999999')
      .expect(404);
  });

  it('GET /api/v1/trips/:id/operator reports the assignment', async () => {
    const created = await db.orm.public.Trip.create(
      createPayload({ operatorId: 7 }),
    );
    const unassigned = await db.orm.public.Trip.create(
      createPayload({ name: 'Desert safari' }),
    );

    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${created.id}/operator`)
      .expect(200);
    expect(res.body).toEqual({ operatorId: 7 });

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
      .send({ operatorId: 7 })
      .expect(200);
    expect(assigned.body.operatorId).toBe(7);

    await request(app.getHttpServer())
      .patch('/api/v1/admin/trips/999999/operator')
      .send({ operatorId: 7 })
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/trips/${created.id}/operator`)
      .send({})
      .expect(400);

    const unassigned = await request(app.getHttpServer())
      .delete(`/api/v1/admin/trips/${created.id}/operator`)
      .expect(200);
    expect(unassigned.body.operatorId).toBeNull();

    // Idempotent second unassign.
    await request(app.getHttpServer())
      .delete(`/api/v1/admin/trips/${created.id}/operator`)
      .expect(200);
  });

  it('GET /api/v1/operators/:id/trips lists assigned trips', async () => {
    await db.orm.public.Trip.create(createPayload({ operatorId: 7 }));
    await db.orm.public.Trip.create(
      createPayload({ name: 'Desert safari', operatorId: 7 }),
    );
    await db.orm.public.Trip.create(createPayload({ name: 'Red Sea dive' }));

    const res = await request(app.getHttpServer())
      .get('/api/v1/operators/7/trips')
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
});

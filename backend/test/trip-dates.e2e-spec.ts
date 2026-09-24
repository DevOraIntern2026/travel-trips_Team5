import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { BOOKING_SEATS_PROVIDER } from './../src/bookings/booking-seats.port.js';
import { db } from './../src/prisma/db.js';
import { clearAllTables } from './helpers/db-cleanup.js';

async function seedTrip(active = true) {
  const destination = await db.orm.public.Destination.create({
    name: `City-${Date.now()}-${Math.random()}`,
    city: 'Cairo',
    country: 'Egypt',
  });
  const trip = await db.orm.public.Trip.create({
    destinationId: destination.id,
    name: 'Nile cruise',
    durationDays: 3,
  });
  if (!active) {
    await db.orm.public.Trip.where({ id: trip.id }).update({
      isActive: false,
    });
  }
  return trip;
}

const datePayload = (overrides = {}) => ({
  startDate: '2026-10-01T10:00:00.000Z',
  endDate: '2026-10-05T18:00:00.000Z',
  price: 99.99,
  capacity: 20,
  ...overrides,
});

function buildApp(bookedSeatsOverride?: (dateId: number) => Promise<number>) {
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideGuard(ThrottlerGuard)
    .useValue({ canActivate: () => true });
  if (bookedSeatsOverride) {
    builder = builder
      .overrideProvider(BOOKING_SEATS_PROVIDER)
      .useValue({ getConfirmedBookedSeats: bookedSeatsOverride });
  }
  return builder.compile();
}

describe('TripDates (e2e)', () => {
  let app: INestApplication<App>;
  let tripId: number;
  let inactiveTripId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await buildApp();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await clearAllTables();
    tripId = (await seedTrip()).id;
    inactiveTripId = (await seedTrip(false)).id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET returns paginated dates ordered by startDate', async () => {
    await db.orm.public.TripDate.create({ tripId, ...datePayload() });
    await db.orm.public.TripDate.create({
      tripId,
      ...datePayload({
        startDate: '2026-11-01T10:00:00.000Z',
        endDate: '2026-11-05T18:00:00.000Z',
      }),
    });
    await db.orm.public.TripDate.create({
      tripId,
      ...datePayload({
        startDate: '2026-09-01T10:00:00.000Z',
        endDate: '2026-09-05T18:00:00.000Z',
      }),
    });

    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates?page=1&limit=2`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
    expect(res.body.data[0].startDate).toContain('2026-09-01');
  });

  it('GET hides inactive dates and dates of inactive trips', async () => {
    const created = await db.orm.public.TripDate.create({
      tripId,
      ...datePayload(),
    });
    await db.orm.public.TripDate.where({ id: created.id }).update({
      isActive: false,
    });

    const empty = await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates`)
      .expect(200);
    expect(empty.body.meta.total).toBe(0);

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${inactiveTripId}/dates`)
      .expect(404);

    await request(app.getHttpServer())
      .get('/api/v1/trips/999999/dates')
      .expect(404);
  });

  it('GET one returns details, 404s on mismatch', async () => {
    const created = await db.orm.public.TripDate.create({
      tripId,
      ...datePayload(),
    });
    const otherTrip = await seedTrip();

    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .expect(200);
    expect(res.body.price).toBe(99.99);
    expect(res.body.capacity).toBe(20);

    // Same date id through another trip: not visible there.
    await request(app.getHttpServer())
      .get(`/api/v1/trips/${otherTrip.id}/dates/${created.id}`)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/999999`)
      .expect(404);
  });

  it('POST creates a date', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(datePayload())
      .expect(201);

    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.price).toBe(99.99);
    expect(res.body.isActive).toBe(true);
  });

  it('POST validates input', async () => {
    // endDate before startDate.
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(
        datePayload({
          startDate: '2026-10-05T18:00:00.000Z',
          endDate: '2026-10-01T10:00:00.000Z',
        }),
      )
      .expect(400);

    // Negative price.
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(datePayload({ price: -5 }))
      .expect(400);

    // Zero capacity.
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(datePayload({ capacity: 0 }))
      .expect(400);

    // More than 2 decimals.
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(datePayload({ price: 99.999 }))
      .expect(400);

    // Bad date string.
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/dates`)
      .send(datePayload({ startDate: 'not-a-date' }))
      .expect(400);
  });

  it('POST rejects unknown or inactive trips', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/trips/999999/dates')
      .send(datePayload())
      .expect(404);

    await request(app.getHttpServer())
      .post(`/api/v1/trips/${inactiveTripId}/dates`)
      .send(datePayload())
      .expect(404);
  });

  it('PUT updates, validates and toggles active', async () => {
    const created = await db.orm.public.TripDate.create({
      tripId,
      ...datePayload(),
    });

    const updated = await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .send({ price: 149.5, capacity: 15 })
      .expect(200);
    expect(updated.body.price).toBe(149.5);

    await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .send({ endDate: '2026-09-01T00:00:00.000Z' })
      .expect(400);

    await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/999999`)
      .send({ capacity: 5 })
      .expect(404);

    const deactivated = await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .send({ isActive: false })
      .expect(200);
    expect(deactivated.body.isActive).toBe(false);

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .expect(404);
  });

  it('DELETE deactivates (idempotent)', async () => {
    const created = await db.orm.public.TripDate.create({
      tripId,
      ...datePayload(),
    });

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .expect(200);
    expect(res.body.isActive).toBe(false);

    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${tripId}/dates/${created.id}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/v1/trips/${tripId}/dates/999999`)
      .expect(404);
  });

  it('GET availability reports computed seats', async () => {
    const created = await db.orm.public.TripDate.create({
      tripId,
      ...datePayload({ capacity: 30 }),
    });

    // Noop provider reports 0 booked: everything remains.
    const res = await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/${created.id}/availability`)
      .expect(200);
    expect(res.body).toEqual({
      tripId,
      dateId: created.id,
      capacity: 30,
      bookedSeats: 0,
      remainingSeats: 30,
      available: true,
    });

    await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/999999/availability`)
      .expect(404);
  });

  it('rejects non-numeric ids with 400', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/trips/${tripId}/dates/abc`)
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/trips/abc/dates')
      .expect(400);
  });
});

describe('TripDates capacity vs bookings (e2e, seam override)', () => {
  let app: INestApplication<App>;
  let tripId: number;
  let dateId: number;

  beforeAll(async () => {
    // Pretend Backend 3 reports 8 confirmed seats for every date.
    const moduleFixture: TestingModule = await buildApp(async () => 8);
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  beforeEach(async () => {
    await clearAllTables();
    tripId = (await seedTrip()).id;
    dateId = (
      await db.orm.public.TripDate.create({
        tripId,
        ...datePayload({ capacity: 20 }),
      })
    ).id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('PUT rejects capacity below booked seats with 409', async () => {
    await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/${dateId}`)
      .send({ capacity: 5 })
      .expect(409);

    const ok = await request(app.getHttpServer())
      .put(`/api/v1/trips/${tripId}/dates/${dateId}`)
      .send({ capacity: 8 })
      .expect(200);
    expect(ok.body.capacity).toBe(8);
  });
});

// File-level teardown: the db singleton is shared by both describes above
// and close() is terminal, so it must run after every describe.
afterAll(async () => {
  await db.close();
});

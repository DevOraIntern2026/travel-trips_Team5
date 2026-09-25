import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { db } from './../src/prisma/db.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';
import { authHeaderFor } from './helpers/auth.js';

describe('Bookings (e2e)', () => {
  let app: INestApplication<App>;
  let tripId: number;
  let tripDateId: number;
  let customerId: number;
  let customerAuth: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearAllTables();
    customerAuth = await authHeaderFor({ email: 'customer@example.com', role: 'Customer' });
    const customer = await db.orm.public.User.where({ email: 'customer@example.com' }).first();
    customerId = customer!.id;

    const destination = await db.orm.public.Destination.create({
      name: 'Cairo',
      city: 'Cairo',
      country: 'Egypt',
    });

    const trip = await db.orm.public.Trip.create({
      destinationId: destination.id,
      name: 'Nile cruise',
      durationDays: 3,
      cancellationWindowHours: 24,
    });
    tripId = trip.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const endFutureDate = new Date(futureDate);
    endFutureDate.setDate(endFutureDate.getDate() + 3);

    const tripDate = await db.orm.public.TripDate.create({
      tripId,
      startDate: futureDate.toISOString(),
      endDate: endFutureDate.toISOString(),
      price: '100',
      capacity: 2,
    });
    tripDateId = tripDate.id;
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  it('POST /bookings creates a booking and reduces capacity', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/bookings')
      .set('Authorization', customerAuth)
      .send({ tripDateId })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toEqual(expect.any(Number));
    expect(res.body.data.status).toBe('Confirmed');

    const tripDate = await db.orm.public.TripDate.where({ id: tripDateId }).first();
    expect(tripDate?.bookedSeats).toBe(1);
  });

  it('POST /bookings rejects when capacity is exceeded', async () => {
    await db.orm.public.Booking.create({ customerId, tripId, tripDateId, price: '100', status: 'Confirmed' });
    await db.orm.public.Booking.create({ customerId, tripId, tripDateId, price: '100', status: 'Confirmed' });
    await db.orm.public.TripDate.where({ id: tripDateId }).update({ bookedSeats: 2 });

    const res = await request(app.getHttpServer())
      .post('/api/v1/bookings')
      .set('Authorization', customerAuth)
      .send({ tripDateId })
      .expect(409);

    expect(res.body.message).toMatch(/No seats available/);
  });

  it('POST /bookings/:id/cancel cancels the booking and frees a seat', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/bookings')
      .set('Authorization', customerAuth)
      .send({ tripDateId })
      .expect(201);
    
    const bookingId = res.body.data.id;

    const cancelRes = await request(app.getHttpServer())
      .post(`/api/v1/bookings/${bookingId}/cancel`)
      .set('Authorization', customerAuth)
      .expect(201);

    expect(cancelRes.body.data.status).toBe('Cancelled');

    const tripDate = await db.orm.public.TripDate.where({ id: tripDateId }).first();
    expect(tripDate?.bookedSeats).toBe(0);
  });

  it('POST /bookings/:id/cancel rejects if cancellation window has passed', async () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const endTmrw = new Date(tmrw);
    endTmrw.setDate(endTmrw.getDate() + 2);

    const destination = await db.orm.public.Destination.first();
    const newTrip = await db.orm.public.Trip.create({
      destinationId: destination!.id,
      name: 'Strict Trip',
      durationDays: 3,
      cancellationWindowHours: 48,
    });
    
    const strictTripDate = await db.orm.public.TripDate.create({
      tripId: newTrip.id,
      startDate: tmrw.toISOString(),
      endDate: endTmrw.toISOString(),
      price: '100',
      capacity: 5,
    });

    const booking = await db.orm.public.Booking.create({
      customerId,
      tripId: newTrip.id,
      tripDateId: strictTripDate.id,
      price: '100',
      status: 'Confirmed'
    });
    await db.orm.public.TripDate.where({ id: strictTripDate.id }).update({ bookedSeats: 1 });

    const cancelRes = await request(app.getHttpServer())
      .post(`/api/v1/bookings/${booking.id}/cancel`)
      .set('Authorization', customerAuth)
      .expect(409);

    expect(cancelRes.body.message).toMatch(/Cancellation window has passed/);
  });
});

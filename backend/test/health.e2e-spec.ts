import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { db } from './../src/prisma/db.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';

describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await clearAllTables();
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  it('GET /api/v1/health reports availability without auth', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('backend');
    expect(res.body.checks.database).toBe('up');
    expect(res.body.timestamp).toBeTruthy();
  });

  it('GET /api/v1/health/ready reports readiness', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200);

    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/v1/health/live reports liveness without touching the DB', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health/live')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });
});

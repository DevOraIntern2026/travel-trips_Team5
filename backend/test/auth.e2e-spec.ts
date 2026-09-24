import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MAILER_PROVIDER } from './../src/auth/mailer.port.js';
import { db } from './../src/prisma/db.js';
import { clearAllTables } from './helpers/db-cleanup.js';
import { createTestApp } from './helpers/test-app.js';

interface SentMail {
  to: string;
  link: string;
}

const sentMails: SentMail[] = [];

function tokenFromLastMail(): string {
  const last = sentMails[sentMails.length - 1];
  if (!last) throw new Error('no mail captured');
  return last.link.split('token=')[1];
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    sentMails.length = 0;
    app = await createTestApp((builder) =>
      builder.overrideProvider(MAILER_PROVIDER).useValue({
        sendVerificationEmail: async (mail: SentMail) => {
          sentMails.push(mail);
        },
        sendPasswordResetEmail: async (mail: SentMail) => {
          sentMails.push(mail);
        },
      }),
    );
  });

  beforeEach(async () => {
    await clearAllTables();
    sentMails.length = 0;
  });

  afterAll(async () => {
    await app.close();
  });

  const registerPayload = (overrides = {}) => ({
    email: 'sara@example.com',
    password: 'S3cure-p@ssphrase',
    ...overrides,
  });

  async function registerAndLogin(email = 'sara@example.com', role?: string) {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(registerPayload({ email }))
      .expect(201);
    if (role) {
      const created = await db.orm.public.User.where((u) =>
        u.email.eq(email),
      ).first();
      await db.orm.public.User.where({ id: created!.id }).update({
        role: role as 'admin',
      });
    }
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: 'S3cure-p@ssphrase' })
      .expect(200);
    return login.body as { accessToken: string; refreshToken: string };
  }

  it('POST /api/v1/auth/register creates Customers', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(registerPayload())
      .expect(201);

    expect(res.body.user.email).toBe('sara@example.com');
    expect(res.body.user.role).toBe('Customer');
    expect(res.body.user.emailVerified).toBe(false);
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(sentMails).toHaveLength(1);
  });

  it('POST /api/v1/auth/register rejects duplicates and bad input', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(registerPayload())
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(registerPayload({ email: 'SARA@example.com' }))
      .expect(409);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'sara@example.com', password: 'short' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'S3cure-p@ssphrase' })
      .expect(400);
  });

  it('POST /api/v1/auth/login accepts and rejects', async () => {
    await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'sara@example.com', password: 'wrong' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever123' })
      .expect(401);
  });

  it('POST /api/v1/auth/refresh rotates, POST logout revokes', async () => {
    const { refreshToken } = await registerAndLogin();

    const rotated = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);
    expect(rotated.body.refreshToken).not.toBe(refreshToken);

    // The spent token is dead (rotation, not reuse yet).
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .send({ refreshToken: rotated.body.refreshToken })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: rotated.body.refreshToken })
      .expect(401);
  });

  it('POST /api/v1/auth/verify-email consumes tokens', async () => {
    await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/auth/verify-email')
      .send({ token: tokenFromLastMail() })
      .expect(200);

    // Consumed tokens do not work twice.
    await request(app.getHttpServer())
      .post('/api/v1/auth/verify-email')
      .send({ token: tokenFromLastMail() })
      .expect(400);

    await request(app.getHttpServer())
      .post('/api/v1/auth/verify-email')
      .send({ token: 'bogus' })
      .expect(400);
  });

  it('POST resend-verification always succeeds', async () => {
    await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/auth/resend-verification')
      .send({ email: 'sara@example.com' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/resend-verification')
      .send({ email: 'nobody@example.com' })
      .expect(200);
  });

  it('POST forgot/reset-password rotates credentials and sessions', async () => {
    const { refreshToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'sara@example.com' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nobody@example.com' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/reset-password')
      .send({ token: tokenFromLastMail(), newPassword: 'N3w-p@ssphrase' })
      .expect(200);

    // Old password dead, old session revoked, new password works.
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'sara@example.com', password: 'S3cure-p@ssphrase' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'sara@example.com', password: 'N3w-p@ssphrase' })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/reset-password')
      .send({ token: 'bogus', newPassword: 'N3w-p@ssphrase' })
      .expect(400);
  });

  it('POST /api/v1/auth/change-password needs auth and the old password', async () => {
    const { accessToken, refreshToken } = await registerAndLogin();

    await request(app.getHttpServer())
      .post('/api/v1/auth/change-password')
      .send({
        currentPassword: 'S3cure-p@ssphrase',
        newPassword: 'N3w-p@ssphrase',
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'wrong', newPassword: 'N3w-p@ssphrase' })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'S3cure-p@ssphrase',
        newPassword: 'N3w-p@ssphrase',
      })
      .expect(200);

    // Sessions from before the change are revoked.
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'sara@example.com', password: 'N3w-p@ssphrase' })
      .expect(200);
  });

  it('POST /api/v1/auth/google rejects invalid tokens with 400', async () => {
    // Holds whether or not GOOGLE_CLIENT_ID is configured: unconfigured →
    // 'not configured', configured → 'invalid token'. Never a 500.
    await request(app.getHttpServer())
      .post('/api/v1/auth/google')
      .send({ idToken: 'anything' })
      .expect(400);
  });

  it('global guards protect management routes by role', async () => {
    const customer = await registerAndLogin('customer@example.com');
    const admin = await registerAndLogin('admin@example.com', 'admin');

    // Anonymous: 401 even on valid input.
    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .send({ name: 'Cairo', city: 'Cairo', country: 'Egypt' })
      .expect(401);

    // Customer: authenticated but unauthorized.
    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ name: 'Cairo', city: 'Cairo', country: 'Egypt' })
      .expect(403);

    // Admin: through.
    await request(app.getHttpServer())
      .post('/api/v1/destinations')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({ name: 'Cairo', city: 'Cairo', country: 'Egypt' })
      .expect(201);

    // Public reads still need no token.
    await request(app.getHttpServer()).get('/api/v1/destinations').expect(200);
  });
});

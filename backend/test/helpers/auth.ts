import request from 'supertest';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { PasswordService } from '../../src/auth/password.service.js';
import { db } from '../../src/prisma/db.js';

const passwords = new PasswordService();

/**
 * Seeds an admin user directly and logs in over HTTP, returning a ready
 * `Authorization` header value. Tables are cleared in beforeEach, so the
 * fixed credentials never collide across tests.
 */
export async function adminHeader(app: INestApplication<App>): Promise<string> {
  const email = 'admin@example.com';
  const password = 'Adm1n-p@ssphrase';
  await db.orm.public.User.create({
    email,
    passwordHash: await passwords.hash(password),
    role: 'admin',
  });
  const login = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);
  return `Bearer ${login.body.accessToken as string}`;
}

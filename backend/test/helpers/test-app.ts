import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ThrottlerStorage,
  type ThrottlerStorageRecord,
} from '@nestjs/throttler';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module.js';

type ModuleBuilder = ReturnType<typeof Test.createTestingModule>;

/**
 * Storage that never counts: the real ThrottlerGuard still executes (route
 * metadata, limits and key generation all run), but no request is ever
 * throttled. E2E suites issue far more than 10 req/60s — including the
 * per-test admin logins — and throttling behavior itself is a framework
 * concern, not a per-feature one. (Overriding the guard class does not
 * reliably replace APP_GUARD registrations, hence this approach.)
 */
const noopThrottlerStorage: ThrottlerStorage = {
  async increment(): Promise<ThrottlerStorageRecord> {
    return {
      totalHits: 0,
      timeToExpire: 0,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  },
};

/**
 * Boots the full app exactly like main.ts (global prefix + validation pipe)
 * with rate limiting neutralized via a non-counting storage override: the
 * real ThrottlerGuard still runs, but suites (dozens of requests including
 * per-test admin logins) never hit 429s.
 * Pass `configure` to customize the testing module (e.g. provider overrides).
 */
export async function createTestApp(
  configure?: (builder: ModuleBuilder) => ModuleBuilder,
): Promise<INestApplication<App>> {
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ThrottlerStorage)
    .useValue(noopThrottlerStorage);
  if (configure) {
    builder = configure(builder);
  }
  const moduleFixture: TestingModule = await builder.compile();
  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

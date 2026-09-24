import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module.js';

type ModuleBuilder = ReturnType<typeof Test.createTestingModule>;

/**
 * Boots the full app exactly like main.ts (global prefix + validation pipe)
 * with the global rate-limit guard bypassed: suites issue more than
 * 10 req/60s, and throttling itself is framework-covered, not per-feature.
 * Pass `configure` to customize the testing module (e.g. provider overrides).
 */
export async function createTestApp(
  configure?: (builder: ModuleBuilder) => ModuleBuilder,
): Promise<INestApplication<App>> {
  let builder = Test.createTestingModule({ imports: [AppModule] })
    .overrideGuard(ThrottlerGuard)
    .useValue({ canActivate: () => true });
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

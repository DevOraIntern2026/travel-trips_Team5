import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule, ObserveInstrument } from './app.module.js';
import { setupSwagger } from './swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Basic security headers
  app.use(helmet());

  // Enable CORS for frontend integration
  app.enableCors();

  // Prefix all routes with /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties not defined in the DTO
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );

  setupSwagger(app);

  // Use the ConfigService to read variables from your .env file
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
await bootstrap();

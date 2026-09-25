import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // 1. Setup Swagger and Scalar Documentation first, so it bypasses Helmet's strict CSP shit
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/openapi.json',
  });
  
  app.use(
    '/reference',
    apiReference({
      spec: {
        url: '/docs/openapi.json',
      },
      theme: 'deepSpace',
      layout: 'modern',
      metaData: {
        title: 'Travel Trips API Documentation',
      },
    }),
  );

  // 2. Now apply default, strict security headers to all actual API endpoints
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


  // Use the ConfigService to read variables from your .env file
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
await bootstrap();

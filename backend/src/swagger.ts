import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Single Swagger setup shared by main.ts and e2e (test/helpers/test-app.ts),
 * so the documented surface is identical in prod and tests.
 *
 * The default bearer scheme ('bearer') is what @ApiBearerAuth() references:
 * it renders the Authorize button in Swagger UI for pasting a JWT.
 */
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);
}

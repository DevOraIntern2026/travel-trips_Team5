import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';

@Module({
  controllers: [DestinationsController],
  // RolesGuard is provided here for direct instantiation in tests;
  // enforcement comes from its global APP_GUARD registration in AuthModule.
  providers: [DestinationsService, RolesGuard],
  exports: [DestinationsService],
})
export class DestinationsModule {}

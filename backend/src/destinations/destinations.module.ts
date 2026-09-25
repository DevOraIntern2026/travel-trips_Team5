import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';

@Module({
  controllers: [DestinationsController],
  // RolesGuard is provided but NOT registered as a global guard yet:
  // TODO(backend-1): register as APP_GUARD alongside the JWT guard that
  // populates request.user. Until then management routes stay public.
  providers: [DestinationsService, RolesGuard],
  exports: [DestinationsService],
})
export class DestinationsModule {}

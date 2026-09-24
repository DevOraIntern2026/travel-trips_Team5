import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard.js';
import { AdminTripsController } from './admin-trips.controller.js';
import { OperatorTripsController } from './operator-trips.controller.js';
import { TripsController } from './trips.controller.js';
import { TripsService } from './trips.service.js';

@Module({
  controllers: [TripsController, AdminTripsController, OperatorTripsController],
  // RolesGuard is provided but NOT registered as a global guard yet:
  // TODO(backend-1): register as APP_GUARD alongside the JWT guard that
  // populates request.user. Until then management routes stay public.
  providers: [TripsService, RolesGuard],
  exports: [TripsService],
})
export class TripsModule {}

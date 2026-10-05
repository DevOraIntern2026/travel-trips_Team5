import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { BookingsModule } from '../bookings/bookings.module.js';
import { AdminTripsController } from './admin-trips.controller.js';
import { OperatorTripsController } from './operator-trips.controller.js';
import { TripsController } from './trips.controller.js';
import { TripsService } from './trips.service.js';

@Module({
  imports: [BookingsModule],
  controllers: [TripsController, AdminTripsController, OperatorTripsController],
  // RolesGuard is provided here for direct instantiation in tests;
  // enforcement comes from its global APP_GUARD registration in AuthModule.
  providers: [TripsService, RolesGuard],
  exports: [TripsService],
})
export class TripsModule {}

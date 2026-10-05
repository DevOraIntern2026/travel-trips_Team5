import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { BookingsModule } from '../bookings/bookings.module.js';
import { TripDatesController } from './trip-dates.controller.js';
import { TripDatesService } from './trip-dates.service.js';

@Module({
  imports: [BookingsModule],
  controllers: [TripDatesController],
  providers: [TripDatesService, RolesGuard],
  exports: [TripDatesService],
})
export class TripDatesModule {}

import { Module } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { AdminOperatorsController } from './admin-operators.controller.js';
import { OperatorsController } from './operators.controller.js';
import { OperatorsService } from './operators.service.js';

@Module({
  controllers: [OperatorsController, AdminOperatorsController],
  providers: [OperatorsService, RolesGuard],
  exports: [OperatorsService],
})
export class OperatorsModule {}

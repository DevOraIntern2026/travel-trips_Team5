import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator.js';
import { AssignOperatorDto } from './dto/assign-operator.dto.js';
import { TripsService } from './trips.service.js';

@ApiTags('admin-trips')
@Controller('admin/trips')
export class AdminTripsController {
  constructor(private readonly trips: TripsService) {}

  @Patch(':tripId/operator')
  @Roles('Admin')
  @ApiOperation({
    summary: 'Assign an operator to a trip (Admin, pending Backend 1)',
  })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'The trip with the operator set.' })
  @ApiResponse({ status: 404, description: 'Trip does not exist.' })
  assignOperator(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body() dto: AssignOperatorDto,
  ) {
    return this.trips.assignOperator(tripId, dto);
  }

  @Delete(':tripId/operator')
  @Roles('Admin')
  @ApiOperation({
    summary:
      'Remove the operator assignment from a trip (Admin, pending Backend 1)',
  })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The trip with the operator unset.',
  })
  @ApiResponse({ status: 404, description: 'Trip does not exist.' })
  unassignOperator(@Param('tripId', ParseIntPipe) tripId: number) {
    return this.trips.unassignOperator(tripId);
  }
}

import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator.js';
import { TripQueryDto } from './dto/trip-query.dto.js';
import { TripsService } from './trips.service.js';

@ApiTags('operators')
@Controller('operators')
export class OperatorTripsController {
  constructor(private readonly trips: TripsService) {}

  @Get(':operatorId/trips')
  @Public()
  @ApiOperation({ summary: 'List active trips assigned to an operator' })
  @ApiParam({ name: 'operatorId', example: 7 })
  @ApiResponse({ status: 200, description: 'Paginated list of trips.' })
  findByOperator(
    @Param('operatorId', ParseIntPipe) operatorId: number,
    @Query() query: TripQueryDto,
  ) {
    // The path id wins over any operatorId query param.
    return this.trips.findByOperator(operatorId, query);
  }
}

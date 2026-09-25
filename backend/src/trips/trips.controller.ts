import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { TripFilterQueryDto } from './dto/trip-filter-query.dto.js';
import { TripQueryDto } from './dto/trip-query.dto.js';
import { TripSearchQueryDto } from './dto/trip-search-query.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { TripsService } from './trips.service.js';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active trips (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of trips.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  findAll(@Query() query: TripQueryDto) {
    return this.trips.findAll(query);
  }

  // NOTE: /trips/search and /trips/filter must stay ABOVE @Get(':tripId'),
  // otherwise 'search'/'filter' would be parsed as a tripId and rejected.
  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search trips by name, text and destination' })
  @ApiResponse({ status: 200, description: 'Paginated matching trips.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  search(@Query() query: TripSearchQueryDto) {
    return this.trips.searchTrips({ ...query, text: query.q });
  }

  @Get('filter')
  @Public()
  @ApiOperation({ summary: 'Filter trips by criteria' })
  @ApiResponse({ status: 200, description: 'Paginated matching trips.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  filter(@Query() query: TripFilterQueryDto) {
    return this.trips.searchTrips(query);
  }

  @Get(':tripId')
  @Public()
  @ApiOperation({ summary: 'Get an active trip by id (with destination)' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'The trip.' })
  @ApiResponse({
    status: 404,
    description: 'Trip does not exist or is inactive.',
  })
  findOne(@Param('tripId', ParseIntPipe) tripId: number) {
    return this.trips.findOne(tripId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a trip (Admin, pending Backend 1)' })
  @ApiResponse({ status: 201, description: 'The created trip.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({
    status: 404,
    description: 'Destination does not exist or is inactive.',
  })
  create(@Body() dto: CreateTripDto) {
    return this.trips.create(dto);
  }

  @Put(':tripId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a trip (Admin, pending Backend 1)' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated trip.' })
  @ApiResponse({ status: 404, description: 'Trip or destination not found.' })
  update(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body() dto: UpdateTripDto,
  ) {
    return this.trips.update(tripId, dto);
  }

  @Delete(':tripId')
  @Roles('Admin')
  @ApiOperation({
    summary: 'Deactivate a trip (Admin, pending Backend 1)',
  })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'The deactivated trip.' })
  @ApiResponse({ status: 404, description: 'Trip does not exist.' })
  remove(@Param('tripId', ParseIntPipe) tripId: number) {
    return this.trips.remove(tripId);
  }

  @Get(':tripId/operator')
  @Public()
  @ApiOperation({ summary: 'Get the operator assigned to a trip' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'The assigned operator id.' })
  @ApiResponse({
    status: 404,
    description: 'Trip not found or no operator assigned.',
  })
  getOperator(@Param('tripId', ParseIntPipe) tripId: number) {
    return this.trips.getOperator(tripId);
  }
}

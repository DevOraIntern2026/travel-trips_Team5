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
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { CreateTripDateDto } from './dto/create-trip-date.dto.js';
import { TripDateQueryDto } from './dto/trip-date-query.dto.js';
import { UpdateTripDateDto } from './dto/update-trip-date.dto.js';
import { TripDatesService } from './trip-dates.service.js';

@ApiTags('trip-dates')
@Controller('trips/:tripId/dates')
export class TripDatesController {
  constructor(private readonly dates: TripDatesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active dates for a trip (paginated)' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 200, description: 'Paginated list of trip dates.' })
  @ApiResponse({ status: 404, description: 'Trip not found or inactive.' })
  findAll(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Query() query: TripDateQueryDto,
  ) {
    return this.dates.findAll(tripId, query);
  }

  @Get(':dateId')
  @Public()
  @ApiOperation({ summary: 'Get an active trip date by id' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiParam({ name: 'dateId', example: 10 })
  @ApiResponse({ status: 200, description: 'The trip date.' })
  @ApiResponse({
    status: 404,
    description: 'Trip/date not found, inactive, or mismatched.',
  })
  findOne(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('dateId', ParseIntPipe) dateId: number,
  ) {
    return this.dates.findOne(tripId, dateId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a trip date (Admin, pending Backend 1)' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiResponse({ status: 201, description: 'The created trip date.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 404, description: 'Trip not found or inactive.' })
  create(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body() dto: CreateTripDateDto,
  ) {
    return this.dates.create(tripId, dto);
  }

  @Put(':dateId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a trip date (Admin, pending Backend 1)' })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiParam({ name: 'dateId', example: 10 })
  @ApiResponse({ status: 200, description: 'The updated trip date.' })
  @ApiResponse({
    status: 404,
    description: 'Trip/date not found or mismatched.',
  })
  @ApiResponse({
    status: 409,
    description: 'Capacity below already-booked seats.',
  })
  update(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('dateId', ParseIntPipe) dateId: number,
    @Body() dto: UpdateTripDateDto,
  ) {
    return this.dates.update(tripId, dateId, dto);
  }

  @Delete(':dateId')
  @Roles('Admin')
  @ApiOperation({
    summary: 'Deactivate a trip date (Admin, pending Backend 1)',
  })
  @ApiParam({ name: 'tripId', example: 1 })
  @ApiParam({ name: 'dateId', example: 10 })
  @ApiResponse({ status: 200, description: 'The deactivated trip date.' })
  @ApiResponse({
    status: 404,
    description: 'Trip/date not found or mismatched.',
  })
  remove(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('dateId', ParseIntPipe) dateId: number,
  ) {
    return this.dates.remove(tripId, dateId);
  }
}

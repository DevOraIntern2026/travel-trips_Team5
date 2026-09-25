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
import { DestinationsService } from './destinations.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { DestinationQueryDto } from './dto/destination-query.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@ApiTags('destinations')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinations: DestinationsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active destinations (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of destinations.' })
  @ApiResponse({ status: 400, description: 'Invalid pagination parameters.' })
  findAll(@Query() query: DestinationQueryDto) {
    return this.destinations.findAll(query);
  }

  @Get(':destinationId')
  @Public()
  @ApiOperation({ summary: 'Get an active destination by id' })
  @ApiParam({ name: 'destinationId', example: 1 })
  @ApiResponse({ status: 200, description: 'The destination.' })
  @ApiResponse({
    status: 404,
    description: 'Destination does not exist or is inactive.',
  })
  findOne(@Param('destinationId', ParseIntPipe) destinationId: number) {
    return this.destinations.findOne(destinationId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create a destination (Admin)' })
  @ApiResponse({ status: 201, description: 'The created destination.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 409, description: 'Destination name already in use.' })
  create(@Body() dto: CreateDestinationDto) {
    return this.destinations.create(dto);
  }

  @Put(':destinationId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a destination (Admin)' })
  @ApiParam({ name: 'destinationId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated destination.' })
  @ApiResponse({ status: 404, description: 'Destination does not exist.' })
  @ApiResponse({ status: 409, description: 'Destination name already in use.' })
  update(
    @Param('destinationId', ParseIntPipe) destinationId: number,
    @Body() dto: UpdateDestinationDto,
  ) {
    return this.destinations.update(destinationId, dto);
  }

  @Delete(':destinationId')
  @Roles('Admin')
  @ApiOperation({
    summary: 'Deactivate a destination (Admin)',
  })
  @ApiParam({ name: 'destinationId', example: 1 })
  @ApiResponse({ status: 200, description: 'The deactivated destination.' })
  @ApiResponse({ status: 404, description: 'Destination does not exist.' })
  remove(@Param('destinationId', ParseIntPipe) destinationId: number) {
    return this.destinations.remove(destinationId);
  }
}

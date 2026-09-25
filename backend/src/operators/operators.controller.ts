import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateOperatorDto } from './dto/create-operator.dto.js';
import { OperatorQueryDto } from './dto/operator-query.dto.js';
import { OperatorStatusDto } from './dto/operator-status.dto.js';
import { UpdateOperatorDto } from './dto/update-operator.dto.js';
import { OperatorsService } from './operators.service.js';

@ApiTags('operators')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operators: OperatorsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active operators (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated operators.' })
  findAll(@Query() query: OperatorQueryDto) {
    return this.operators.findAll(query);
  }

  @Get(':operatorId')
  @Public()
  @ApiOperation({ summary: 'Get an active operator by id' })
  @ApiParam({ name: 'operatorId', example: 1 })
  @ApiResponse({ status: 200, description: 'The operator.' })
  @ApiResponse({ status: 404, description: 'Operator not found or inactive.' })
  findOne(@Param('operatorId', ParseIntPipe) operatorId: number) {
    return this.operators.findOne(operatorId);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create an operator (Admin)' })
  @ApiResponse({ status: 201, description: 'The created operator.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(@Body() dto: CreateOperatorDto) {
    return this.operators.create(dto);
  }

  @Put(':operatorId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update an operator (Admin)' })
  @ApiParam({ name: 'operatorId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated operator.' })
  @ApiResponse({ status: 404, description: 'Operator not found.' })
  update(
    @Param('operatorId', ParseIntPipe) operatorId: number,
    @Body() dto: UpdateOperatorDto,
  ) {
    return this.operators.update(operatorId, dto);
  }

  @Patch(':operatorId/status')
  @Roles('Admin')
  @ApiOperation({ summary: 'Activate or deactivate an operator (Admin)' })
  @ApiParam({ name: 'operatorId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated operator.' })
  @ApiResponse({ status: 404, description: 'Operator not found.' })
  setStatus(
    @Param('operatorId', ParseIntPipe) operatorId: number,
    @Body() dto: OperatorStatusDto,
  ) {
    return this.operators.setStatus(operatorId, dto);
  }
}

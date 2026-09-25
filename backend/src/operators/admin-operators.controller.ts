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
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateOperatorDto } from './dto/create-operator.dto.js';
import { OperatorQueryDto } from './dto/operator-query.dto.js';
import { OperatorStatusDto } from './dto/operator-status.dto.js';
import { UpdateOperatorDto } from './dto/update-operator.dto.js';
import { OperatorsService } from './operators.service.js';

/**
 * Admin operator management (§3.6-10). Thin wrappers over OperatorsService:
 * no logic lives here, so behavior cannot diverge from the plain routes.
 */
@ApiTags('admin-operators')
@Controller('admin/operators')
export class AdminOperatorsController {
  constructor(private readonly operators: OperatorsService) {}

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'List all operators, any status (Admin)' })
  @ApiResponse({ status: 200, description: 'Paginated operators.' })
  findAll(@Query() query: OperatorQueryDto) {
    return this.operators.findAll(query, false);
  }

  @Get(':operatorId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get an operator, any status (Admin)' })
  @ApiParam({ name: 'operatorId', example: 1 })
  @ApiResponse({ status: 200, description: 'The operator.' })
  @ApiResponse({ status: 404, description: 'Operator not found.' })
  findOne(@Param('operatorId', ParseIntPipe) operatorId: number) {
    return this.operators.findOne(operatorId, false);
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create an operator as Admin' })
  @ApiResponse({ status: 201, description: 'The created operator.' })
  create(@Body() dto: CreateOperatorDto) {
    return this.operators.create(dto);
  }

  @Put(':operatorId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update an operator as Admin' })
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
  @ApiOperation({ summary: 'Activate or deactivate an operator as Admin' })
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

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UserStatusDto } from './dto/user-status.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated profile' })
  @ApiResponse({ status: 200, description: 'The profile.' })
  @ApiResponse({ status: 401, description: 'Unauthenticated.' })
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.users.getProfile(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update the authenticated profile' })
  @ApiResponse({ status: 200, description: 'The updated profile.' })
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.users.updateProfile(user.id, dto);
  }

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'List users for Admin management' })
  @ApiResponse({ status: 200, description: 'Paginated users, all statuses.' })
  findAll(@Query() query: UserQueryDto) {
    return this.users.findAll(query);
  }

  // NOTE: 'me' above must stay declared before ':userId'.
  @Get(':userId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get a user by id (Admin)' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiResponse({ status: 200, description: 'The user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.users.findOne(userId);
  }

  @Put(':userId')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update a user (Admin)' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated user.' })
  @ApiResponse({ status: 403, description: 'Cannot change your own role.' })
  @ApiResponse({ status: 404, description: 'User or operator not found.' })
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() requester: AuthenticatedUser,
  ) {
    return this.users.updateUser(userId, dto, requester);
  }

  @Patch(':userId/status')
  @Roles('Admin')
  @ApiOperation({ summary: 'Activate or deactivate a user (Admin)' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiResponse({ status: 200, description: 'The updated user.' })
  @ApiResponse({ status: 403, description: 'Cannot change your own status.' })
  setStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UserStatusDto,
    @CurrentUser() requester: AuthenticatedUser,
  ) {
    return this.users.setStatus(userId, dto, requester);
  }
}

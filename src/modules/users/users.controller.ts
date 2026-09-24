import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { Roles } from '../../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.js';

import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateUserStatusDto } from './dto/update-user-status.dto.js';
import { UsersService } from './users.service.js';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;

    return this.usersService.getMe(user.sub);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = request.user as AuthenticatedUser;

    return this.usersService.updateMe(user.sub, updateProfileDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getUserById(@Param('userId') userId: string) {
    return this.usersService.getUserById(userId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Patch(':userId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateUserStatus(
      userId,
      updateUserStatusDto,
    );
  }
}
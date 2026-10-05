import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../auth/authenticated-user.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { BookingsService } from './bookings.service.js';
import { BookingQueryDto } from './dto/booking-query.dto.js';
import {
  BookingListResponseDto,
  BookingResponseDto,
  BookingStatusResponseDto,
  ConflictErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
} from './dto/booking-response.dto.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@ApiTags('Customer Bookings')
@ApiBearerAuth()
@Roles('Customer')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  @ApiResponse({
    status: 403,
    description: 'Customers only',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Trip date not found',
    type: NotFoundErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'No seats available or booking conflict',
    type: ConflictErrorDto,
  })
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const booking = await this.bookingsService.createBooking(
      user.id,
      createBookingDto,
    );
    return {
      success: true,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List customer bookings' })
  @ApiOkResponse({
    description: 'List of bookings returned',
    type: BookingListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  @ApiResponse({
    status: 403,
    description: 'Customers only',
    type: ForbiddenErrorDto,
  })
  async getBookings(
    @Query() query: BookingQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const bookings = await this.bookingsService.getBookings(
      user.id,
      query.page,
      query.limit,
    );
    return { success: true, data: bookings };
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiOkResponse({
    description: 'Booking details returned',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Not your booking)',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
    type: NotFoundErrorDto,
  })
  async getBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const booking = await this.bookingsService.getBooking(user.id, bookingId);
    return { success: true, data: booking };
  }

  @Post(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiCreatedResponse({
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Not your booking)',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
    type: NotFoundErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Cancellation window passed or already cancelled',
    type: ConflictErrorDto,
  })
  async cancelBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const booking = await this.bookingsService.cancelBooking(
      user.id,
      bookingId,
    );
    return {
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    };
  }

  @Get(':bookingId/status')
  @ApiOperation({ summary: 'Get booking status' })
  @ApiOkResponse({
    description: 'Booking status returned',
    type: BookingStatusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Not your booking)',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found',
    type: NotFoundErrorDto,
  })
  async getBookingStatus(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const status = await this.bookingsService.getBookingStatus(
      user.id,
      bookingId,
    );
    return { success: true, data: status };
  }
}

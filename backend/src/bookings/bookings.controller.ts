import { Controller, Get, Post, Body, Param, Query, Req, ParseIntPipe } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingResponseDto, BookingListResponseDto, BookingStatusResponseDto, NotFoundErrorDto, ConflictErrorDto, ForbiddenErrorDto } from './dto/booking-response.dto.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Customer Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({ 
    description: 'Booking created successfully',
    type: BookingResponseDto
  })
  @ApiResponse({ status: 404, description: 'Trip date not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 409, description: 'No seats available or booking conflict', type: ConflictErrorDto })
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: AuthenticatedRequest) {
    // TODO
    const customerId = req.user?.id || 1; // Fallback for dev only
    const booking = await this.bookingsService.createBooking(customerId, createBookingDto);
    return { success: true, message: 'Booking created successfully', data: booking };
  }

  @Get()
  @ApiOperation({ summary: 'List customer bookings' })
  @ApiOkResponse({ 
    description: 'List of bookings returned',
    type: BookingListResponseDto
  })
  async getBookings(@Query('page') page: string, @Query('limit') limit: string, @Req() req: AuthenticatedRequest) {
    const customerId = req.user?.id || 1;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const bookings = await this.bookingsService.getBookings(customerId, pageNumber, limitNumber);
    return { success: true, data: bookings };
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiOkResponse({ 
    description: 'Booking details returned',
    type: BookingResponseDto
  })
  @ApiResponse({ status: 403, description: 'Forbidden (Not your booking)', type: ForbiddenErrorDto })
  @ApiResponse({ status: 404, description: 'Booking not found', type: NotFoundErrorDto })
  async getBooking(@Param('bookingId', ParseIntPipe) bookingId: number, @Req() req: AuthenticatedRequest) {
    const customerId = req.user?.id || 1;
    const booking = await this.bookingsService.getBooking(customerId, bookingId);
    return { success: true, data: booking };
  }

  @Post(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiCreatedResponse({ 
    description: 'Booking cancelled successfully',
    type: BookingResponseDto
  })
  @ApiResponse({ status: 403, description: 'Forbidden (Not your booking)', type: ForbiddenErrorDto })
  @ApiResponse({ status: 404, description: 'Booking not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 409, description: 'Cancellation window passed or already cancelled', type: ConflictErrorDto })
  async cancelBooking(@Param('bookingId', ParseIntPipe) bookingId: number, @Req() req: AuthenticatedRequest) {
    const customerId = req.user?.id || 1;
    const booking = await this.bookingsService.cancelBooking(customerId, bookingId);
    return { success: true, message: 'Booking cancelled successfully', data: booking };
  }

  @Get(':bookingId/status')
  @ApiOperation({ summary: 'Get booking status' })
  @ApiOkResponse({ 
    description: 'Booking status returned',
    type: BookingStatusResponseDto
  })
  @ApiResponse({ status: 404, description: 'Booking not found', type: NotFoundErrorDto })
  async getBookingStatus(@Param('bookingId', ParseIntPipe) bookingId: number, @Req() req: AuthenticatedRequest) {
    const customerId = req.user?.id || 1;
    const status = await this.bookingsService.getBookingStatus(customerId, bookingId);
    return { success: true, data: status };
  }
}

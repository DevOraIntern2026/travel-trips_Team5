import { ApiProperty } from '@nestjs/swagger';

class BookingDataDto {
  @ApiProperty({ example: 101, description: 'The unique ID of the booking' })
  id: number;

  @ApiProperty({ example: 1, description: 'The ID of the customer who made the booking' })
  customerId: number;

  @ApiProperty({ example: 5, description: 'The ID of the trip' })
  tripId: number;

  @ApiProperty({ example: 42, description: 'The ID of the specific trip date' })
  tripDateId: number;

  @ApiProperty({ example: '299.99', description: 'The price of the booking' })
  price: string;

  @ApiProperty({ example: 'Confirmed', description: 'The current status of the booking' })
  status: string;

  @ApiProperty({ example: '2026-10-15T10:30:00Z', description: 'When the booking was created' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-15T10:30:00Z', description: 'When the booking was last updated', required: false })
  updatedAt?: Date;
}

export class BookingResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Booking created successfully', required: false })
  message?: string;

  @ApiProperty({ type: BookingDataDto })
  data: BookingDataDto;
}

export class BookingListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [BookingDataDto] })
  data: BookingDataDto[];
}

export class BookingStatusResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    example: { status: 'Confirmed' },
    description: 'The current status of the booking'
  })
  data: { status: string };
}

export class NotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Booking not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class ConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'No seats available' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'You can only view your own bookings' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}

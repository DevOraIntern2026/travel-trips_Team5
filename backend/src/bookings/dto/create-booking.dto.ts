import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {

  @ApiProperty({ example: 1, description: 'The ID of the trip date' })
  @IsInt()
  @IsNotEmpty()
  tripDateId: number;
}

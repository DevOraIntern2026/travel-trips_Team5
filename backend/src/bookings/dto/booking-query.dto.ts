import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_BOOKINGS_PAGE = 1;
export const DEFAULT_BOOKINGS_LIMIT = 10;
export const MAX_BOOKINGS_LIMIT = 50;

export class BookingQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_BOOKINGS_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_BOOKINGS_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_BOOKINGS_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_BOOKINGS_LIMIT)
  limit: number = DEFAULT_BOOKINGS_LIMIT;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_TRIP_DATES_PAGE = 1;
export const DEFAULT_TRIP_DATES_LIMIT = 10;
export const MAX_TRIP_DATES_LIMIT = 50;

export class TripDateQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_TRIP_DATES_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_TRIP_DATES_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_TRIP_DATES_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_TRIP_DATES_LIMIT)
  limit: number = DEFAULT_TRIP_DATES_LIMIT;
}

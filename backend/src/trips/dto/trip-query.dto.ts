import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const DEFAULT_TRIPS_PAGE = 1;
export const DEFAULT_TRIPS_LIMIT = 10;
export const MAX_TRIPS_LIMIT = 50;

export const TRIP_SORTS = ['price_asc', 'price_desc', 'date_asc'] as const;
export type TripSort = (typeof TRIP_SORTS)[number];

export class TripQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_TRIPS_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_TRIPS_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_TRIPS_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_TRIPS_LIMIT)
  limit: number = DEFAULT_TRIPS_LIMIT;

  @ApiPropertyOptional({
    example: 'Nile cruise',
    description: 'Case-insensitive search by trip name.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationId?: number;

  @ApiPropertyOptional({ example: 7 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  operatorId?: number;

  @ApiPropertyOptional({
    example: 'price_asc',
    enum: TRIP_SORTS,
    description:
      'Sort by lowest date price, highest date price, or earliest date.',
  })
  @IsOptional()
  @IsIn(TRIP_SORTS)
  sort?: TripSort;
}

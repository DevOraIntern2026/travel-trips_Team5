import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  DEFAULT_TRIPS_LIMIT,
  DEFAULT_TRIPS_PAGE,
  MAX_TRIPS_LIMIT,
} from './trip-query.dto.js';

const toBoolean = ({ value }: { value: unknown }): unknown => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false' || value === undefined) {
    return value === undefined ? undefined : false;
  }
  return value;
};

export class TripFilterQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationId?: number;

  @ApiPropertyOptional({
    example: '2026-10-03',
    description: 'Calendar day (UTC): trips with an active date covering it.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 50 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 200 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  minDuration?: number;

  @ApiPropertyOptional({ example: 7 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  maxDuration?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Only trips with at least one bookable date.',
  })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  availableOnly?: boolean;

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
}

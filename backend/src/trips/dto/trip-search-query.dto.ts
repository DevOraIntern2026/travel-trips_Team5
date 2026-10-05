import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  DEFAULT_TRIPS_LIMIT,
  DEFAULT_TRIPS_PAGE,
  MAX_TRIPS_LIMIT,
} from './trip-query.dto.js';

export class TripSearchQueryDto {
  @ApiProperty({
    example: 'Nile',
    description:
      'Case-insensitive match against trip name, description and destination name/city/country.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  q!: string;

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

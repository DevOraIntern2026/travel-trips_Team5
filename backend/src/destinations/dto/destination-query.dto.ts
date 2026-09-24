import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const DEFAULT_DESTINATIONS_PAGE = 1;
export const DEFAULT_DESTINATIONS_LIMIT = 10;
export const MAX_DESTINATIONS_LIMIT = 50;

export class DestinationQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_DESTINATIONS_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_DESTINATIONS_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_DESTINATIONS_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_DESTINATIONS_LIMIT)
  limit: number = DEFAULT_DESTINATIONS_LIMIT;

  @ApiPropertyOptional({
    example: 'Cairo',
    description: 'Case-insensitive search by destination name.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

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

export const DEFAULT_OPERATORS_PAGE = 1;
export const DEFAULT_OPERATORS_LIMIT = 10;
export const MAX_OPERATORS_LIMIT = 50;

export class OperatorQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_OPERATORS_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_OPERATORS_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_OPERATORS_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_OPERATORS_LIMIT)
  limit: number = DEFAULT_OPERATORS_LIMIT;

  @ApiPropertyOptional({
    example: 'Nile',
    description: 'Case-insensitive search by company name.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { toNumberOrNull, trimString } from '../../common/transforms.js';

export class UpdateTripDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  destinationId?: number;

  @ApiPropertyOptional({ example: 'Old Cairo walking tour', maxLength: 150 })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @ApiPropertyOptional({
    example: 7,
    description: 'Set null to unassign the operator.',
  })
  @Transform(toNumberOrNull)
  @IsOptional()
  @IsInt()
  @Min(1)
  operatorId?: number | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Set false to deactivate, true to reactivate.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

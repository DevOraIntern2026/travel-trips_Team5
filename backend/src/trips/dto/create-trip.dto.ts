import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { toNumberOrNull, trimString } from '../../common/transforms.js';

export class CreateTripDto {
  @ApiProperty({ example: 1, description: 'Must be an active destination.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  destinationId!: number;

  @ApiProperty({ example: 'Old Cairo walking tour', maxLength: 150 })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 3, description: 'Duration in days (min 1).' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays!: number;

  @ApiPropertyOptional({
    example: 7,
    description:
      'Operator id. No existence check yet — validated once Backend 1 lands.',
  })
  @Transform(toNumberOrNull)
  @IsOptional()
  @IsInt()
  @Min(1)
  operatorId?: number | null;
}

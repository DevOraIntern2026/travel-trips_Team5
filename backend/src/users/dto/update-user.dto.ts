import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { toNumberOrNull, trimString } from '../../common/transforms.js';
import type { UserRole } from '../../auth/decorators/roles.decorator.js';

export const MANAGEABLE_ROLES: readonly UserRole[] = [
  'Admin',
  'Operator',
  'Customer',
];

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Sara' })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'sara_travels' })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(60)
  username?: string;

  @ApiPropertyOptional({ example: 'Operator', enum: MANAGEABLE_ROLES })
  @IsOptional()
  @IsIn(MANAGEABLE_ROLES)
  role?: UserRole;

  @ApiPropertyOptional({
    example: 3,
    description:
      'Company link. Only valid with role Operator; null unlinks. ' +
      'Requires an existing active operator.',
  })
  @Transform(toNumberOrNull)
  @IsOptional()
  @IsInt()
  @Min(1)
  operatorId?: number | null;
}

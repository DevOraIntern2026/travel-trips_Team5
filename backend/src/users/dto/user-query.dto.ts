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

export const DEFAULT_USERS_PAGE = 1;
export const DEFAULT_USERS_LIMIT = 10;
export const MAX_USERS_LIMIT = 50;

export class UserQueryDto {
  @ApiPropertyOptional({ example: 1, default: DEFAULT_USERS_PAGE })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_USERS_PAGE;

  @ApiPropertyOptional({ example: 10, default: DEFAULT_USERS_LIMIT })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_USERS_LIMIT)
  limit: number = DEFAULT_USERS_LIMIT;

  @ApiPropertyOptional({
    example: 'sara',
    description: 'Case-insensitive search by name, username or email.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;
}

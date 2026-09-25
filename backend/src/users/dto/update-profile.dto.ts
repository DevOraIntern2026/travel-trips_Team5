import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { trimString } from '../../common/transforms.js';

export class UpdateProfileDto {
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
}

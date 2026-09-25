import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { trimString } from '../../common/transforms.js';

export class UpdateOperatorDto {
  @ApiPropertyOptional({ example: 'Nile Adventures', maxLength: 150 })
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
}

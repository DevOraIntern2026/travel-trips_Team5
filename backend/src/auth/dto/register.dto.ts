import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { trimString } from '../../common/transforms.js';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'sara@example.com' })
  @Transform(trimString)
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'S3cure-p@ssphrase', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({ example: 'Sara' })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;
}

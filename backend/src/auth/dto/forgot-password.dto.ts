import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';
import { trimString } from '../../common/transforms.js';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'sara@example.com' })
  @Transform(trimString)
  @IsEmail()
  @MaxLength(255)
  email!: string;
}

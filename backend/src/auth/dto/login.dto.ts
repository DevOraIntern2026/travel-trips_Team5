import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { trimString } from '../../common/transforms.js';

export class LoginDto {
  @ApiProperty({ example: 'sara@example.com' })
  @Transform(trimString)
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'S3cure-p@ssphrase' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

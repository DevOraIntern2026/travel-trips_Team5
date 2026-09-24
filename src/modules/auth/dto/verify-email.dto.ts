import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(500)
  token: string;
}
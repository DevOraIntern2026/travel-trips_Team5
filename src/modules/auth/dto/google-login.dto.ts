import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  idToken: string;
}
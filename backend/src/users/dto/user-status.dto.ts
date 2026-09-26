import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive!: boolean;
}

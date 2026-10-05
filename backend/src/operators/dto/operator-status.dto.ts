import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class OperatorStatusDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive!: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AssignOperatorDto {
  @ApiProperty({
    example: 7,
    description:
      'Operator id. Existence is validated once Backend 1 lands (TODO).',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  operatorId!: number;
}

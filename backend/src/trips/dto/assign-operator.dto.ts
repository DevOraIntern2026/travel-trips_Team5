import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AssignOperatorDto {
  @ApiProperty({
    example: 7,
    description:
      'Operator id. Must reference an existing, active operator (validated with 404).',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  operatorId!: number;
}

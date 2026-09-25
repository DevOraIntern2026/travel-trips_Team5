import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateTripDateDto {
  @ApiProperty({ example: '2026-10-01T10:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-10-05T18:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    example: 99.99,
    description: 'JSON number, max 2 decimals, min 0. Stored exact.',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ example: 20, description: 'Minimum 1.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity!: number;
}

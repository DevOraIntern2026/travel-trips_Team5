import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateDestinationDto {
  @ApiPropertyOptional({ example: 'Cairo', maxLength: 120 })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Cairo', maxLength: 120 })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ example: 'Egypt', maxLength: 120 })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  country?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Set false to deactivate, true to reactivate.',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly domain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly logo: string;
}

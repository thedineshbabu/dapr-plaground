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

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly role: string;
}

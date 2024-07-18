// dto/users.dto.ts

import { IsString, IsEmail, IsNotEmpty, IsUUID, IsBoolean, IsDateString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  roleid: string; // Ensure roleid is defined here with proper validation

  @IsDateString()
  @IsNotEmpty()
  created_at: string;

  @IsDateString()
  @IsNotEmpty()
  modified_at: string;

  @IsString()
  @IsNotEmpty()
  created_by: string;

  @IsString()
  @IsNotEmpty()
  modified_by: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}

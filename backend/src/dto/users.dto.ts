import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUUID,
  IsBoolean,
  IsISO8601,
} from "class-validator";

export class CreateUsersDto {
  @IsNotEmpty({ message: "name should not be empty" })
  @IsString({ message: "name must be a string" })
  name: string;

  @IsNotEmpty({ message: "email should not be empty" })
  @IsEmail({}, { message: "email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "password should not be empty" })
  @IsString({ message: "password must be a string" })
  password: string;

  @IsNotEmpty({ message: "roleid should not be empty" })
  @IsUUID("4", { message: "roleid must be a UUID" })
  roleid: string;

  // @IsNotEmpty({ message: 'created_at should not be empty' })
  // @IsISO8601({}, { message: 'created_at must be a valid ISO 8601 date string' })
  // created_at: string;

  // @IsNotEmpty({ message: 'modified_at should not be empty' })
  // @IsISO8601({}, { message: 'modified_at must be a valid ISO 8601 date string' })
  // modified_at: string;

  // @IsNotEmpty({ message: 'created_by should not be empty' })
  // @IsString({ message: 'created_by must be a string' })
  // created_by: string;

  // @IsNotEmpty({ message: 'modified_by should not be empty' })
  // @IsString({ message: 'modified_by must be a string' })
  // modified_by: string;

  // @IsNotEmpty({ message: 'is_active should not be empty' })
  // @IsBoolean({ message: 'is_Extracted passwordactive must be a boolean value' })
  // is_active: boolean;
}

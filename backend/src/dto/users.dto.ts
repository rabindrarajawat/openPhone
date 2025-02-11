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

 

 @IsNotEmpty({ message: "roleName should not be empty" })
  @IsString({ message: "roleName must be a string" })
  roleName: string; // Role name instead of role ID

}

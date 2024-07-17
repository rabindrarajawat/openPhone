import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;


}

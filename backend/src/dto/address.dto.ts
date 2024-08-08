import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";
import { DeepPartial } from "typeorm";

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

    is_bookmarked:boolean;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
  created_by: string;
  is_active: boolean;
}

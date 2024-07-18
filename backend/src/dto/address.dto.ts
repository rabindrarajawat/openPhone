import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";
import { DeepPartial } from "typeorm";

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
  created_by: string;
  // conversation_id: number;
  is_active: DeepPartial<boolean>;
  name: string;


}

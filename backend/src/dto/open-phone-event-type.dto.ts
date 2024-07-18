import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class OpenPhoneEventTypeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

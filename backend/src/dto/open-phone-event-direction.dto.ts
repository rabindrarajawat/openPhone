import { IsNotEmpty, IsString } from "class-validator";

export class OpenPhoneEventDirectionDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

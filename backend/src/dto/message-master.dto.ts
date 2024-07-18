import { IsNumber } from "class-validator";

export class MessageMasterDto{
  @IsNumber()
  id: number;

  @IsNumber()
  message: string;
}

import { IsNumber } from "class-validator";

export class TaxDeadDto {
  @IsNumber()
  id: number;

  @IsNumber()
  event_id: number;
}

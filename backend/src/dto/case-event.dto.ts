import { IsNumber } from "class-validator";

export class CaseEventDto {
  @IsNumber()
  id: number;

  @IsNumber()
  event_id: number;
}

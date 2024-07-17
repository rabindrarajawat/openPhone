import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class OpenPhoneEventDto {
  @IsNotEmpty()
  @IsInt()
  event_type_id: number;

  @IsNotEmpty()
  @IsInt()
  address_id: number;

  @IsNotEmpty()
  @IsInt()
  event_direction_id: number;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  url_type: string;

  @IsNotEmpty()
  @IsString()
  conversation_id: string;

  @IsNotEmpty()
  @IsDateString()
  created_at: Date;

  @IsNotEmpty()
  @IsDateString()
  received_at: Date;

  @IsOptional()
  @IsString()
  contact_established?: string;

  @IsOptional()
  @IsString()
  dead?: string;

  @IsOptional()
  @IsString()
  keep_an_eye?: string;

  @IsOptional()
  @IsString()
  stop?: string;

  @IsOptional()
  @IsString()
  created_by?: string;

  @IsOptional()
  @IsString()
  modified_by?: string;

  @IsOptional()
  @IsString()
  modified_at?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

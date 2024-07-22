import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class AuctionEventDto {
  @IsNumber()
  event_id: number;

  @IsOptional()
  @IsString()
  created_by?: string;

  @IsOptional()
  @IsString()
  created_at?: string;

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
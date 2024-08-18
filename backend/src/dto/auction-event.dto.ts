  import { IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

  export class AuctionEventDto {
    @IsNumber()
    event_id: number;

    @IsOptional()
    @IsString()
    created_by?: string;

    @IsOptional()
    @IsDateString()
    created_at?: string;

    @IsOptional()
    @IsString()
    modified_by?: string;

    @IsOptional()
    @IsDateString()
    modified_at?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
  }

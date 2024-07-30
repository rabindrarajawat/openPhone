import { IsNumber, IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class conversationmappingDto {

    @IsNotEmpty()
    @IsString()
    conversationId: string;

    @IsNumber()
    address_id: number;

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


}
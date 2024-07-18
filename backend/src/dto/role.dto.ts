import { IsNotEmpty, Length, IsOptional } from "class-validator";

export class RoleDto {
  @IsNotEmpty()
  @Length(1, 100) 
  name: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  modified_at?: Date;

  @IsOptional()
  created_by?: string;

  @IsOptional()
  modified_by?: string;

  @IsOptional()
  is_active?: boolean;
}

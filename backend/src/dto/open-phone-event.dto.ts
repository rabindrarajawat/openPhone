// // // 


// // import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

// // export class CreateAuctionEventDto {
// //   @IsNumber()
// //   event_id: number;

// //   @IsOptional()
// //   @IsString()
// //   created_by?: string;

// //   @IsOptional()
// //   @IsString()
// //   created_at?: string;

// //   @IsOptional()
// //   @IsString()
// //   modified_by?: string;

// //   @IsOptional()
// //   @IsString()
// //   modified_at?: string;

// //   @IsOptional()
// //   @IsBoolean()
// //   is_active?: boolean;
// // }



// import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';

// export class OpenPhoneEventDto {
//   @IsNotEmpty()
//   @IsInt()
//   event_type_id: number;

//   @IsNotEmpty()
//   @IsInt()
//   address_id: number;

//   @IsNotEmpty()
//   @IsInt()
//   event_direction_id: number;

//   @IsNotEmpty()
//   @IsString()
//   from: string;

//   @IsNotEmpty()
//   @IsString()
//   to: string;

//   @IsNotEmpty()
//   @IsString()
//   body: string;

//   @IsNotEmpty()
//   @IsString()
//   url: string;

//   @IsNotEmpty()
//   @IsString()
//   url_type: string;

//   @IsNotEmpty()
//   @IsString()
//   conversation_id: number;

//   @IsNotEmpty()
//   @IsDateString()
//   created_at: Date;

//   @IsNotEmpty()
//   @IsDateString()
//   received_at: Date;

//   @IsOptional()
//   @IsString()
//   contact_established?: string;

//   @IsOptional()
//   @IsString()
//   dead?: string;

//   @IsOptional()
//   @IsString()
//   keep_an_eye?: string;

//   @IsOptional()
//   @IsString()
//   stop?: string;

//   @IsOptional()
//   @IsString()
//   created_by?: string;

  

//   @IsOptional()
//   @IsString()
//   modified_by?: string;

//   @IsOptional()
//   @IsString()
//   modified_at?: string;

//   @IsOptional()
//   @IsBoolean()
//   is_active?: boolean;
// }









import { IsNotEmpty, IsString, IsObject, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MediaDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

class MessageObjectDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  object: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  direction: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  phoneNumberId: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}

export class OpenPhoneEventDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  object: string;

  @IsNotEmpty()
  @IsString()
  apiVersion: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => MessageObjectDto)
  data: {
    object: MessageObjectDto;
  };
}
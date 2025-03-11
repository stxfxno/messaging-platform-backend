// src/messages/dto/create-message.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @IsUUID()
  @IsNotEmpty()
  sender_id: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
// src/conversations/dto/create-conversation.dto.ts
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  participant_ids: string[];
}

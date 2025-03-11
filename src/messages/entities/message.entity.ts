// src/messages/entities/message.entity.ts
export class Message {
    id: string; // uuid
    conversation_id: string;
    sender_id: string;
    content?: string;
    image_url?: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
  }
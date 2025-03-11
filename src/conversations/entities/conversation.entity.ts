// src/conversations/entities/conversation.entity.ts
export class Conversation {
  id: string; // uuid
  created_at: Date;
  updated_at: Date;
}

export class ConversationParticipant {
  id: string; // uuid
  conversation_id: string;
  user_id: string;
  created_at: Date;
}

// src/messages/messages.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

// Interfaces para tipar las respuestas de Supabase
interface CountResponse {
  count: number | null;
  error: any;
}

interface DataResponse<T> {
  data: T | null;
  error: any;
}

@Injectable()
export class MessagesService {
  constructor(private supabaseService: SupabaseService) {}

  // src/messages/messages.service.ts
  async findAllByConversation(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ messages: Message[]; total: number }> {
    // Calcular rango para paginación
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Obtener conteo total
    const countResponse = await this.supabaseService
      .getClient()
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('conversation_id', conversationId);

    const total = countResponse.count || 0;

    // Obtener mensajes paginados
    const response = await this.supabaseService
      .getClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (response.error) throw response.error;

    return {
      messages: response.data as Message[],
      total,
    };
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { data, error }: DataResponse<Message> = await this.supabaseService
      .getClient()
      .from('messages')
      .insert([createMessageDto])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create message');

    return data;
  }

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  }
}

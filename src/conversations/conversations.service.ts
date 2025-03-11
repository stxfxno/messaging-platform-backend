// src/conversations/conversations.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

// Interfaces para tipar correctamente las respuestas de Supabase
interface ParticipationRecord {
  conversation_id: string;
}

interface UserRecord {
  id: string;
  full_name: string;
  avatar_url?: string;
  last_seen?: string;
}

interface MessageRecord {
  id: string;
  content?: string;
  image_url?: string;
  created_at: string;
  is_read: boolean;
  sender_id: string;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

interface ParticipantRecord {
  user_id: string;
  users: UserRecord;
}

interface ConversationRecord {
  id: string;
  created_at: string;
  updated_at: string;
  participants: ParticipantRecord[];
  latest_message: MessageRecord[];
}

// En conversations.service.ts
export interface ConversationWithParticipants {
  id: string;
  participants: UserRecord[];
  latestMessage: MessageRecord | null;
  created_at: string;
  updated_at: string;
}

interface ConversationParticipant {
  conversation_id: string;
}

@Injectable()
export class ConversationsService {
  constructor(private supabaseService: SupabaseService) {}

  async findOrCreateBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Conversation> {
    // Buscar si ya existe una conversación entre estos usuarios
    const supabase = this.supabaseService.getClient();

    // Primero obtenemos todas las conversaciones del usuario1
    const userConversationsResponse: SupabaseResponse<
      ConversationParticipant[]
    > = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId1);

    if (userConversationsResponse.error) throw userConversationsResponse.error;
    if (!userConversationsResponse.data?.length) {
      // Si el usuario1 no tiene conversaciones, crear una nueva
      return this.createConversationBetween(userId1, userId2);
    }

    // Convertir explícitamente a array tipado
    const conversationIds = userConversationsResponse.data.map(
      (c) => c.conversation_id,
    );

    // Buscar si alguna de esas conversaciones incluye al usuario2
    const sharedConversationsResponse: SupabaseResponse<
      ConversationParticipant[]
    > = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId2)
      .in('conversation_id', conversationIds);

    if (sharedConversationsResponse.error)
      throw sharedConversationsResponse.error;

    // Si no existe una conversación compartida, crear una nueva
    if (
      !sharedConversationsResponse.data ||
      sharedConversationsResponse.data.length === 0
    ) {
      return this.createConversationBetween(userId1, userId2);
    }

    // Si existe, obtener los detalles de la primera conversación compartida
    const conversationId = sharedConversationsResponse.data[0].conversation_id;

    // Obtén la respuesta completa sin desestructurar
    const response: SupabaseResponse<Conversation> = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (response.error) throw response.error;
    if (!response.data) throw new Error('Conversation not found');

    // Retornar los datos de la conversación
    return response.data;
  }

  // Método auxiliar para crear una nueva conversación entre dos usuarios
  private async createConversationBetween(
    userId1: string,
    userId2: string,
  ): Promise<Conversation> {
    // Crear una nueva conversación
    const supabase = this.supabaseService.getClient();

    // 1. Crear la conversación
    const conversationResponse: SupabaseResponse<Conversation> = await supabase
      .from('conversations')
      .insert({ created_at: new Date().toISOString() })
      .select()
      .single();

    if (conversationResponse.error) throw conversationResponse.error;
    if (!conversationResponse.data)
      throw new Error('Failed to create conversation');

    // 2. Añadir participantes
    const participantsData = [
      { conversation_id: conversationResponse.data.id, user_id: userId1 },
      { conversation_id: conversationResponse.data.id, user_id: userId2 },
    ];

    const participantsResponse = await supabase
      .from('conversation_participants')
      .insert(participantsData);

    if (participantsResponse.error) throw participantsResponse.error;

    return conversationResponse.data;
  }

  async findAllByUser(userId: string): Promise<ConversationWithParticipants[]> {
    // Find all conversations where the user is a participant
    const participationsResponse: SupabaseResponse<ParticipationRecord[]> =
      await this.supabaseService
        .getClient()
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

    if (participationsResponse.error) throw participationsResponse.error;
    if (!participationsResponse.data?.length) return [];

    const conversationIds = participationsResponse.data.map(
      (p) => p.conversation_id,
    );

    // Get conversations with the latest message and participants info
    const conversationsResponse: SupabaseResponse<ConversationRecord[]> =
      await this.supabaseService
        .getClient()
        .from('conversations')
        .select(
          `
        *,
        participants:conversation_participants(
          user_id,
          users:user_id(id, full_name, avatar_url, last_seen)
        ),
        latest_message:messages(
          id, content, image_url, created_at, is_read, sender_id
        )
      `,
        )
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

    if (conversationsResponse.error) throw conversationsResponse.error;
    if (!conversationsResponse.data) return [];

    // Process the data to format it appropriately
    return conversationsResponse.data.map((conversation) => {
      // Find the other participants (not the current user)
      const otherParticipants = conversation.participants
        .filter((p) => p.user_id !== userId)
        .map((p) => p.users);

      // Get the latest message if any
      const latestMessage =
        conversation.latest_message.length > 0
          ? conversation.latest_message.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )[0]
          : null;

      return {
        id: conversation.id,
        participants: otherParticipants,
        latestMessage,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
      };
    });
  }

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    try {
      // Start a transaction
      const supabase = this.supabaseService.getClient();

      console.log('Intentando crear conversación...');

      // Crear la conversación
      const conversationResponse: SupabaseResponse<Conversation> =
        await supabase
          .from('conversations')
          .insert({ created_at: new Date().toISOString() })
          .select()
          .single();

      if (conversationResponse.error) {
        console.error(
          'Error al crear conversación:',
          conversationResponse.error,
        );
        throw conversationResponse.error;
      }

      if (!conversationResponse.data) {
        console.error('No se pudo crear la conversación: respuesta vacía');
        throw new Error('Failed to create conversation');
      }

      console.log(
        'Conversación creada exitosamente:',
        conversationResponse.data,
      );

      // 2. Add participants
      const participantsData = createConversationDto.participant_ids.map(
        (userId) => ({
          conversation_id: conversationResponse.data!.id, // Nota el signo ! aquí
          user_id: userId,
        }),
      );

      console.log('Intentando agregar participantes:', participantsData);

      const participantsResponse = await supabase
        .from('conversation_participants')
        .insert(participantsData);

      if (participantsResponse.error) {
        console.error(
          'Error al agregar participantes:',
          participantsResponse.error,
        );
        throw participantsResponse.error;
      }

      console.log('Participantes agregados exitosamente');
      return conversationResponse.data;
    } catch (error) {
      console.error('Excepción capturada en create:', error);
      throw error;
    }
  }
}

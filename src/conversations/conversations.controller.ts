// src/conversations/conversations.controller.ts
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConversationsService } from './conversations.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationWithParticipants } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('between/:userId1/:userId2')
  findOrCreateBetweenUsers(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
    @Req() request: Request,
  ): Promise<Conversation> {
    // Usar de manera consistente el token extraído por el middleware
    const authToken = request['supabaseToken'];
    console.log(
      'Token en findOrCreateBetweenUsers:',
      authToken ? 'Presente' : 'Ausente',
    );

    return this.conversationsService.findOrCreateBetweenUsers(
      userId1,
      userId2,
      authToken,
    );
  }

  @Get('user/:userId')
  findAllByUser(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<ConversationWithParticipants[]> {
    const authToken = request['supabaseToken'];
    console.log('Token en findAllByUser:', authToken ? 'Presente' : 'Ausente');

    return this.conversationsService.findAllByUser(userId, authToken);
  }

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @Req() request: Request,
  ): Promise<Conversation> {
    const authToken = request['supabaseToken'];
    console.log(
      'Token en create conversation:',
      authToken ? 'Presente' : 'Ausente',
    );

    return this.conversationsService.create(createConversationDto, authToken);
  }
}

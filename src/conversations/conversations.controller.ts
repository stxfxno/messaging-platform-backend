// src/conversations/conversations.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
// En conversations.controller.ts
import { ConversationWithParticipants } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // src/conversations/conversations.controller.ts
  @Get('between/:userId1/:userId2')
  findOrCreateBetweenUsers(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ): Promise<Conversation> {
    return this.conversationsService.findOrCreateBetweenUsers(userId1, userId2);
  }

  @Get('user/:userId')
  findAllByUser(
    @Param('userId') userId: string,
  ): Promise<ConversationWithParticipants[]> {
    return this.conversationsService.findAllByUser(userId);
  }

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationsService.create(createConversationDto);
  }
}

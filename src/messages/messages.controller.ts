// src/messages/messages.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // src/messages/messages.controller.ts
  @Get('conversation/:id')
  findAllByConversation(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ messages: Message[]; total: number }> {
    return this.messagesService.findAllByConversation(id, page, limit);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string): Promise<void> {
    return this.messagesService.markAsRead(id);
  }
}

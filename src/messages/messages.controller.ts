// src/messages/messages.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversation/:id')
  findAllByConversation(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Req() request: Request,
  ): Promise<{ messages: Message[]; total: number }> {
    const authToken = request['supabaseToken'];
    return this.messagesService.findAllByConversation(
      id,
      page,
      limit,
      authToken,
    );
  }

  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() request: Request,
  ): Promise<Message> {
    const authToken = request['supabaseToken'];
    return this.messagesService.create(createMessageDto, authToken);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const authToken = request['supabaseToken'];
    return this.messagesService.markAsRead(id, authToken);
  }
}

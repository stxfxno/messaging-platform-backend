// src/users/users.controller.ts
import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() request: Request): Promise<User[]> {
    const authToken = request['supabaseToken'];
    return this.usersService.findAll(authToken);
  }

  @Get('search')
  searchContacts(
    @Query('term') term: string,
    @Req() request: Request,
  ): Promise<User[]> {
    const authToken = request['supabaseToken'];
    return this.usersService.searchContacts(term, authToken);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request): Promise<User> {
    const authToken = request['supabaseToken'];
    return this.usersService.findOne(id, authToken);
  }

  @Put(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
  ): Promise<User> {
    const authToken = request['supabaseToken'];
    return this.usersService.updateProfile(id, updateProfileDto, authToken);
  }
}

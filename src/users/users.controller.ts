// src/users/users.controller.ts
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('search')
  searchContacts(@Query('term') term: string): Promise<User[]> {
    return this.usersService.searchContacts(term);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  // En src/users/users.controller.ts
  @Put(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(id, updateProfileDto);
  }
}

// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto): Promise<User> {
    const { email } = loginDto;

    const response = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (response.error) throw response.error;
    if (!response.data) throw new Error('Usuario no encontrado');

    return response.data as User;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, full_name, phone_number } = registerDto;

    const userId = randomUUID();

    const response = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        id: userId,
        email,
        full_name,
        phone_number,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (response.error) throw response.error;
    if (!response.data) throw new Error('Failed to create user');

    return response.data as User;
  }
}

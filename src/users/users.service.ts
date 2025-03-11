// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Interfaces para las respuestas de Supabase
interface DataResponse<T> {
  data: T | null;
  error: any;
}

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  // En src/users/users.service.ts
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    // Filtramos para eliminar propiedades undefined
    const updateData = Object.entries(updateProfileDto)
      .filter(([, value]) => value !== undefined) // Cambio de [_] a [,] para evitar error de ESLint
      .reduce<Record<string, any>>(
        (acc, [key, value]: [string, unknown]) => ({
          ...acc,
          [key]: value as string | number | boolean | null,
        }),
        {},
      );

    if (Object.keys(updateData).length === 0) {
      // No hay datos para actualizar
      return this.findOne(userId);
    }

    // Actualizamos el perfil
    interface SupabaseResponse<T> {
      data: T | null;
      error: any;
    }

    const response: SupabaseResponse<User> = await this.supabaseService
      .getClient()
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (response.error)
      throw new Error(
        (response.error as Error).message || 'Failed to update profile',
      );
    if (!response.data) throw new Error('User not found');

    return response.data;
  }

  async findAll(): Promise<User[]> {
    const { data, error }: DataResponse<User[]> = await this.supabaseService
      .getClient()
      .from('users')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async findOne(id: string): Promise<User> {
    const { data, error }: DataResponse<User> = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`User with ID ${id} not found`);

    return data;
  }

  async searchContacts(searchTerm: string): Promise<User[]> {
    const { data, error }: DataResponse<User[]> = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

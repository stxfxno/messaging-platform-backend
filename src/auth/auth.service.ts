// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Usar el método signInWithPassword de Supabase Auth
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw error;

    // Obtener los datos del usuario además de los datos de sesión
    const userResponse = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userResponse.error) throw userResponse.error;

    // Devolver el usuario y la sesión (importante: contiene el token de acceso)
    return {
      user: userResponse.data,
      session: data.session,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, full_name, phone_number } = registerDto;

    // Registrar con Supabase Auth
    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone_number,
        },
      },
    });

    if (error) throw error;

    // Crear entrada en la tabla users con el UUID generado por Supabase Auth
    if (data.user) {
      const userResponse = await this.supabaseService
        .getClient()
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name,
          phone_number,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userResponse.error) throw userResponse.error;

      // Devolver el usuario y la sesión
      return {
        user: userResponse.data,
        session: data.session,
      };
    }

    throw new Error('No se pudo crear el usuario');
  }
}

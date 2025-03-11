// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Opción 1: Usa directamente las cadenas
    this.supabase = createClient(
      'https://kjierrlfdzwojznniezu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaWVycmxmZHp3b2p6bm5pZXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NzM2MTksImV4cCI6MjA1NzA0OTYxOX0.aiBZi5C56xRxn-iy0csKO_IUUyrvrFa_Yo4j4CLO7XE',
    );

    // Opción 2: Si quieres usar ConfigService correctamente
    // Primero debes definir estas variables en tu archivo .env
    // this.supabase = createClient(
    //   this.configService.get<string>('SUPABASE_URL') || '',
    //   this.configService.get<string>('SUPABASE_KEY') || ''
    // );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}

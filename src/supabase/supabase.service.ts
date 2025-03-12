// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseUrl = 'https://kjierrlfdzwojznniezu.supabase.co';
  private supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaWVycmxmZHp3b2p6bm5pZXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NzM2MTksImV4cCI6MjA1NzA0OTYxOX0.aiBZi5C56xRxn-iy0csKO_IUUyrvrFa_Yo4j4CLO7XE';

  constructor(private configService: ConfigService) {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  getClient(authToken?: string): SupabaseClient {
    // Si se proporciona un token de autenticación, crear un nuevo cliente con la sesión
    if (authToken) {
      return createClient(this.supabaseUrl, this.supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });
    }
    return this.supabase;
  }
}

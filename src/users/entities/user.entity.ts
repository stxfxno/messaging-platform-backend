// src/users/entities/user.entity.ts
export class User {
  id: string; // uuid
  email: string;
  full_name: string;
  avatar_url?: string;
  last_seen?: Date;
  created_at: Date;
  updated_at: Date;
}

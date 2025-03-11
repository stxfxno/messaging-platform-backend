// src/users/dto/update-profile.dto.ts
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}

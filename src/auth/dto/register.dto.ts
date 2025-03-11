// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('PE') // Para Perú
  phone_number: string;
}

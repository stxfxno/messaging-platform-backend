// src/auth/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extraer token de Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        console.log('Token JWT extraído correctamente');
        // Guardar el token en el objeto request para uso posterior
        req['supabaseToken'] = token;
      } else {
        console.log('Token JWT no encontrado en el header de Authorization');
      }
    } else {
      console.log('Header de Authorization no encontrado o formato incorrecto');
    }
    next();
  }
}

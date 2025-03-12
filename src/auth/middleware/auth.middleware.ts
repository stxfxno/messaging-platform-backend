// src/auth/middleware/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extraer token de Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      req['supabaseToken'] = authHeader.split(' ')[1];
    }
    next();
  }
}
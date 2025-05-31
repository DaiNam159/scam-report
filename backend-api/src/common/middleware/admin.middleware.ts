// src/common/middleware/admin.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user || user.isAdmin !== true) {
      throw new ForbiddenException('Access denied. Admin only.');
    }
    next();
  }
}

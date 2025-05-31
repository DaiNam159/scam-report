// src/admin/admin.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminMiddleware } from '../../common/middleware/admin.middleware';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes({ path: 'admin', method: RequestMethod.ALL });
  }
}

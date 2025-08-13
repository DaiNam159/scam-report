import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // chỉ log lỗi và cảnh báo
  });
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();

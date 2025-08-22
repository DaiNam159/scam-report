import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // chỉ log lỗi và cảnh báo
  });
  const config = new DocumentBuilder()
    .setTitle('Report API') // Tiêu đề
    .setDescription('API Website báo cáo lừa đảo và link độc hại') // Mô tả
    .setVersion('1.0') // Version
    .addBearerAuth() // Nếu dùng JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONTEND_PORT, 'http://localhost:3000'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();

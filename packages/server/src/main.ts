import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get('COOKIE_SECRET');
  const port = configService.get('PORT');

  app.use(cookieParser(cookieSecret));
  await app.listen(port);
}
bootstrap();

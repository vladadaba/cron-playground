import 'source-map-support/register';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';

dotenv.config();

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Offers API')
    .setDescription('API used for retrieving parsed offers')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get<ConfigService>(ConfigService);

  if (configService.get<boolean>('SWAGGER_ENABLE')) {
    createSwagger(app);
  }

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

import * as morgan from 'morgan';
import * as compression from 'compression';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import { ValidationPipe } from '@/core/pipes/validation.pipe';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.use(compression());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
};

bootstrap();

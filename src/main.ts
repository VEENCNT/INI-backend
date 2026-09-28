import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';

import { join } from 'path';

import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(import.meta.dirname, '..', 'public'));
  app.setBaseViewsDir(join(import.meta.dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(import.meta.dirname, '..', 'views', 'partials'));

  hbs.registerHelper('formatNumber', (value: any) => {
    if (value === null || value === undefined) return '';
    const num = Number(value);
    return isNaN(num) ? value : num;
  });

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
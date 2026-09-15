import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BiochemicalIndicatorModule } from './biochemical-indicator/biochemical-indicator.module.js';

import { join } from 'path';

import hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BiochemicalIndicatorModule);

  app.useStaticAssets(join(import.meta.dirname, '..', 'public'));
  app.setBaseViewsDir(join(import.meta.dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(import.meta.dirname, '..', 'views', 'partials'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
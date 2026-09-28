import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { User } from '../src/biochemical-indicator/entities/user.entity.js';
import { BiochemicalIndicator } from '../src/biochemical-indicator/entities/biochemical-indicator.entity.js';
import { Like } from '../src/biochemical-indicator/entities/like.entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, BiochemicalIndicator, Like],
  synchronize: true,
});

async function run() {
  await dataSource.initialize();
  await dataSource.synchronize();
  console.log('Миграции выполнены успешно.');
  await dataSource.destroy();
  process.exit(0);
}

run().catch((err) => {
  console.error('Ошибка миграций:', err);
  process.exit(1);
});
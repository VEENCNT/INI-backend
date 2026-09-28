import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';
import { BiochemicalIndicatorController } from './biochemical-indicator.controller.js';
import { AuthController } from '../auth/auth.controller.js';

import { User } from './entities/user.entity.js';
import { BiochemicalIndicator } from './entities/biochemical-indicator.entity.js';
import { Like } from './entities/like.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, BiochemicalIndicator, Like])],
  controllers: [BiochemicalIndicatorController, AuthController],
  providers: [BiochemicalIndicatorService],
})
export class BiochemicalIndicatorModule {}
import { Module } from '@nestjs/common';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';
import { BiochemicalIndicatorController } from './biochemical-indicator.controller.js';

@Module({
  controllers: [BiochemicalIndicatorController],
  providers: [BiochemicalIndicatorService],
})
export class BiochemicalIndicatorModule {}

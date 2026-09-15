import { Controller, Get, Query, Render } from '@nestjs/common';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';

@Controller()
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
  ) {}

  @Get()
  @Render('feed')
  getFeedRoot(
    @Query('indicatorId') indicatorId?: string,
    @Query('switchToNextIndicator') switchToNextIndicator?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      switchToNextIndicator
    );
  }

  @Get('feed')
  @Render('feed')
  getIndicatorFeed(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      next
    );
  }

  @Get('grid')
  @Render('grid')
  getIndicatorsGrid(
    @Query('bloodSubstanceConcentration') bloodSubstanceConcentration?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorsGridData(
      bloodSubstanceConcentration
    );
  }

  @Get('add')
  @Render('add')
  getDraftIndicatorForm() {
    return {};
  }
}
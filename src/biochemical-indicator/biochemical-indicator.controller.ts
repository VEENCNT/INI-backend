import { Controller, Get, Query, Render } from '@nestjs/common';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';

@Controller()
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
  ) {}

  @Get()
  @Render('indicatorFeed')
  getIndicatorFeedRoot(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      next
    );
  }

  @Get('indicatorFeed')
  @Render('indicatorFeed')
  getIndicatorFeed(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      next
    );
  }

  @Get('indicatorGrid')
  @Render('indicatorGrid')
  getIndicatorsGrid(
    @Query('indicatorConcentration') indicatorConcentration?: string,
  ) {
    return this.biochemicalIndicatorService.getIndicatorGridData(
      indicatorConcentration
    );
  }

  @Get('indicatorDraftForm')
  @Render('indicatorDraftForm')
  getIndicatorDraftForm() {
    return {};
  }
}
import { Controller, Get, Post, Query, Render, Redirect, Body } from '@nestjs/common';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';

@Controller()
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
  ) {}

  @Get()
  @Render('indicatorFeed')
  async getIndicatorFeedRoot(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return await this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      next
    );
  }

  @Get('indicatorFeed')
  @Render('indicatorFeed')
  async getIndicatorFeed(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return await this.biochemicalIndicatorService.getIndicatorFeedData(
      indicatorId,
      next
    );
  }

  @Get('indicatorGrid')
  @Render('indicatorGrid')
  async getIndicatorsGrid(
    @Query('indicatorConcentration') indicatorConcentration?: string,
  ) {
    return await this.biochemicalIndicatorService.getIndicatorGridData(
      indicatorConcentration
    );
  }

  @Get('indicatorDraft')
  @Render('indicatorDraft')
  async getIndicatorDraft() {
    const creatorId = 1;

    const indicatorDraft = await this.biochemicalIndicatorService.findIndicatorDraftData(creatorId);

    return {
      isDraftCreated: !!indicatorDraft,
      ...indicatorDraft
    };
  }

  @Post('indicatorDraft/next')
  @Redirect('/indicatorDraft', 302)
  async createIndicatorDraft(
    @Body('title') title: string
  ) {
    const creatorId = 1;

    await this.biochemicalIndicatorService.createIndicatorDraftData({
      title,
      creatorId
    });
  }

  @Post('indicatorDraft/form')
  @Redirect('/indicatorDraft', 302)
  async formIndicatorDraft(
    @Body('indicatorId') indicatorId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('lowerReferenceLimit') lowerReferenceLimit: string,
    @Body('upperReferenceLimit') upperReferenceLimit: string,
  ) {
    await this.biochemicalIndicatorService.formIndicatorDraftData(Number(indicatorId), {
      title,
      description,
      lowerReferenceLimit: Number(lowerReferenceLimit),
      upperReferenceLimit: Number(upperReferenceLimit),
    });
  }

  @Post('indicatorGrid/delete')
  @Redirect('/indicatorGrid', 302)
  async deleteIndicator(
    @Query('indicatorId') indicatorId: string,
  ) {
    await this.biochemicalIndicatorService.deleteIndicatorData(indicatorId);
  }
}
import { Controller, Get, Post, Query, Render, Redirect, Body, Param, Delete } from '@nestjs/common';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';

@Controller()
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
  ) {}

  @Get()
  @Render('biochemicalIndicatorFeed')
  async getBiochemicalIndicatorFeedRoot(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return await this.biochemicalIndicatorService.getBiochemicalIndicatorFeed(
      indicatorId,
      next
    );
  }

  @Get('biochemicalIndicatorFeed')
  @Render('biochemicalIndicatorFeed')
  async getBiochemicalIndicatorFeed(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return await this.biochemicalIndicatorService.getBiochemicalIndicatorFeed(
      indicatorId,
      next
    );
  }

  @Get('biochemicalIndicatorGrid')
  @Render('biochemicalIndicatorGrid')
  async getBiochemicalIndicatorsGrid(
    @Query('indicatorConcentration') indicatorConcentration?: string,
  ) {
    return await this.biochemicalIndicatorService.getBiochemicalIndicatorGrid(
      indicatorConcentration
    );
  }

  @Get('biochemicalIndicatorDraft')
  @Render('biochemicalIndicatorDraft')
  async getBiochemicalIndicatorDraft() {
    const indicatorDraft = await this.biochemicalIndicatorService.getBiochemicalIndicatorDraft();

    return {
      isDraftCreated: !!indicatorDraft,
      ...indicatorDraft
    };
  }

  @Post('biochemicalIndicatorDraft/next')
  @Redirect('/biochemicalIndicatorDraft', 302)
  async createBiochemicalIndicatorDraft(
    @Body('title') title: string
  ) {
    await this.biochemicalIndicatorService.createBiochemicalIndicatorDraft(title);
  }

  @Post('biochemicalIndicatorDraft/form')
  @Redirect('/biochemicalIndicatorDraft', 302)
  async formBiochemicalIndicatorDraft(
    @Body('description') description: string,
    @Body('lowerReferenceLimit') lowerReferenceLimit: string,
    @Body('upperReferenceLimit') upperReferenceLimit: string,
  ) {
    await this.biochemicalIndicatorService.formBiochemicalIndicatorDraft(
      description,
      Number(lowerReferenceLimit),
      Number(upperReferenceLimit),
    );
  }

  @Delete('biochemicalIndicatorGrid/delete/:id')
  @Redirect('/biochemicalIndicatorGrid', 302)
  async deleteBiochemicalIndicator(
    @Param('id') indicatorId: string
  ) {
    await this.biochemicalIndicatorService.deleteBiochemicalIndicator(indicatorId);
  }
}
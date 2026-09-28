import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';
import { MinioService } from '../minio/minio.service.js';

@Controller('api/biochemical-indicators')
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
    private readonly minioService: MinioService,
  ) {}

  @Get()
  async getIndicatorsList(@Query('indicatorConcentration') indicatorConcentration?: string) {
    return await this.biochemicalIndicatorService.getIndicatorsList(indicatorConcentration);
  }

  @Get('feed')
  async getIndicatorFeed(
    @Query('indicatorId') indicatorId?: string,
    @Query('next') next?: string,
  ) {
    return await this.biochemicalIndicatorService.getIndicatorFeed(indicatorId, next);
  }

  @Get('draft')
  async getIndicatorDraft() {
    return await this.biochemicalIndicatorService.findIndicatorDraft();
  }

  @Post('draft')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createIndicatorDraft(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('lowerReferenceLimit') lowerReferenceLimit: string,
    @Body('upperReferenceLimit') upperReferenceLimit: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    let imageUrl = '';
    let videoUrl = '';

    if (files?.image?.[0]) {
      imageUrl = await this.minioService.uploadFile(files.image[0]);
    }
    if (files?.video?.[0]) {
      videoUrl = await this.minioService.uploadFile(files.video[0]);
    }

    return await this.biochemicalIndicatorService.createIndicatorDraft(
      title,
      description,
      lowerReferenceLimit ? Number(lowerReferenceLimit) : 0,
      upperReferenceLimit ? Number(upperReferenceLimit) : 0,
      imageUrl,
      videoUrl,
    );
  }

  @Put('/draft/publish')
  async publishIndicator() {
    return await this.biochemicalIndicatorService.publishIndicator();
  }

  @Delete(':id')
  async deleteIndicator(@Param('id', ParseIntPipe) id: number) {
    return await this.biochemicalIndicatorService.deleteIndicator(id);
  }

  @Post(':id/like')
  async likeIndicator(
    @Param('id', ParseIntPipe) indicatorId: number,
    @Body('like') like: number,
  ) {
    return await this.biochemicalIndicatorService.likeIndicator(indicatorId, Number(like));
  }
}
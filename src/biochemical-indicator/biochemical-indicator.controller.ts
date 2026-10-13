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
  ParseIntPipe
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ApiTags, ApiOperation, ApiConsumes, ApiOkResponse, ApiBody } from '@nestjs/swagger';

import { BiochemicalIndicatorService } from './biochemical-indicator.service.js';
import { MinioService } from '../minio/minio.service.js';

import { Authenticated  } from '../auth/auth.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

import { BiochemicalIndicatorResponseDto } from './dto/biochemical-indicator-response.dto.js';
import { CreateBiochemicalIndicatorDraftDto, PublishBiochemicalIndicatorDto, LikeBiochemicalIndicatorDto } from './dto/biochemical-indicator-input.dto.js';
import { BiochemicalIndicatorListQueryDto, BiochemicalIndicatorFeedQueryDto } from './dto/biochemical-indicator-query.dto.js'

@ApiTags('Biochemical Indicators')
@Controller('api/biochemical-indicators')
export class BiochemicalIndicatorController {
  constructor(
    private readonly biochemicalIndicatorService: BiochemicalIndicatorService,
    private readonly minioService: MinioService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить список показателей' })
  @ApiOkResponse({ type: BiochemicalIndicatorResponseDto, isArray: true })
  async getBiochemicalIndicatorsList(
    @CurrentUser() userId: number | null,
    @Query() query: BiochemicalIndicatorListQueryDto
  ) {
    return await this.biochemicalIndicatorService.getBiochemicalIndicatorsList(userId, query.indicatorConcentration);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Получить ленту показателей' })
  @ApiOkResponse({ type: BiochemicalIndicatorResponseDto })
  async getBiochemcialIndicatorFeed(
    @CurrentUser() userId: number | null,
    @Query() query: BiochemicalIndicatorFeedQueryDto
  ) {
    return await this.biochemicalIndicatorService.getBiochemicalIndicatorFeed(userId, query.indicatorId, query.next);
  }

  @Get('draft')
  @Authenticated()
  @ApiOperation({ summary: 'Получить черновик показателя' })
  @ApiOkResponse({ type: BiochemicalIndicatorResponseDto })
  async getBiochemicalIndicatorDraft(@CurrentUser() userId: number) {
    return await this.biochemicalIndicatorService.findBiochemicalIndicatorDraft(userId);
  }

  @Post('draft')
  @Authenticated()
  @ApiOperation({ summary: 'Создать или обновить черновик показателя' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Лимфоциты' },
        image: { type: 'string', format: 'binary' },
        video: { type: 'string', format: 'binary' },
      },
    },
  })
  async createBiochemicalIndicatorDraft(
    @CurrentUser() userId: number,
    @Body() body: CreateBiochemicalIndicatorDraftDto,
    @UploadedFiles() files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] }
  ) {
    const title = body.title;

    const imageUrl = files?.image?.[0]
      ? await this.minioService.uploadFile(files.image[0])
      : '';
    const videoUrl = files?.video?.[0]
      ? await this.minioService.uploadFile(files.video[0])
      : '';

    return await this.biochemicalIndicatorService.createBiochemicalIndicatorDraft(
      userId,
      title,
      imageUrl,
      videoUrl,
    );
  }

  @Put('/draft/publish')
  @Authenticated()
  @ApiOperation({ summary: 'Опубликовать показатель' })
  async publishBiochemicalIndicator(
    @CurrentUser() userId: number,
    @Body() body: PublishBiochemicalIndicatorDto
  ) {
    return await this.biochemicalIndicatorService.publishBiochemicalIndicator(
      userId,
      body.description,
      body.lowerReferenceLimit,
      body.upperReferenceLimit,
    );
  }

  @Delete(':id')
  @Authenticated()
  @ApiOperation({ summary: 'Удалить показатель' })
  async deleteBiochemicalIndicator(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) indicatorId: number
  ) {
    return await this.biochemicalIndicatorService.deleteBiochemicalIndicator(userId, indicatorId);
  }

  @Post(':id/like')
  @Authenticated()
  @ApiOperation({ summary: 'Поставить/убрать лайк' })
  async likeBiochemicalIndicator(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) indicatorId: number,
    @Body() body: LikeBiochemicalIndicatorDto
  ) {
    return await this.biochemicalIndicatorService.likeBiochemicalIndicator(userId, indicatorId, body.like);
  }
}
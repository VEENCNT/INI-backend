import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

import { User } from './entities/user.entity.js';
import { BiochemicalIndicator } from './entities/biochemical-indicator.entity.js';
import { Like } from './entities/like.entity.js';

@Injectable()
export class BiochemicalIndicatorService {
  constructor(
    @InjectRepository(BiochemicalIndicator)
    private readonly indicatorRepository: Repository<BiochemicalIndicator>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async getIndicatorFeedData(indicatorIdQuery?: string, next?: string) {
    const currentId = indicatorIdQuery ? parseInt(indicatorIdQuery, 10) : 0;

    let indicator;

    if (next === 'true') {
      indicator = await this.indicatorRepository.findOne({
        where: {
          status: 'FORMED',
          indicatorId: MoreThan(currentId),
        },
        order: {
          indicatorId: 'ASC',
        },
        relations: {
          likes: true,
        },
      });

      if (!indicator) {
        indicator = await this.indicatorRepository.findOne({
          where: { status: 'FORMED' },
          order: { indicatorId: 'ASC' },
          relations: { likes: true },
        });
      }
    } 
    else if (indicatorIdQuery) {
      indicator = await this.indicatorRepository.findOne({
        where: {
          indicatorId: currentId,
          status: 'FORMED',
        },
        relations: {
          likes: true,
        },
      });
    } 
    else {
      indicator = await this.indicatorRepository.findOne({
        where: { status: 'FORMED' },
        order: { indicatorId: 'ASC' },
        relations: { likes: true },
      });
    }

    if (!indicator) {
      throw new NotFoundException('Показатель не найден');
    }

    return {
      biochemicalIndicator: {
        ...indicator,
        likesCount: indicator.likes ? indicator.likes.length : 0,
      },
    };
  }

  async getIndicatorGridData(indicatorConcentration?: string) {
    const searchedConcentration = indicatorConcentration
      ? parseFloat(indicatorConcentration)
      : undefined;

    const isConcentrationValid = searchedConcentration !== undefined && !isNaN(searchedConcentration);

    const where = {
      status: 'FORMED',
      ...(isConcentrationValid && {
        lowerReferenceLimit: LessThanOrEqual(searchedConcentration),
        upperReferenceLimit: MoreThanOrEqual(searchedConcentration),
      }),
    };

    const indicators = await this.indicatorRepository.find({
      where,
      relations: {
        likes: true
      }
    });

    return {
      biochemicalIndicators: indicators.map((item) => ({
        ...item,
        likesCount: item.likes ? item.likes.length : 0,
      })),
      searchedConcentration: indicatorConcentration || '',
    };
  }

  async findIndicatorDraftData(creatorId: number = 1) {
    return await this.indicatorRepository.findOne({
      where: {creatorId, status: "CREATED"}
    });
  }

  async createIndicatorDraftData(data: {title: string, imageUrl?: string, videoUrl?: string, creatorId?: number}) {
    let indicatorDraft = await this.findIndicatorDraftData();

    if (indicatorDraft) {
      indicatorDraft.title = data.title;
      indicatorDraft.imageUrl = data.imageUrl ?? "";
      indicatorDraft.videoUrl = data.videoUrl ?? "";
    }
    else {
      indicatorDraft = this.indicatorRepository.create({
        title: data.title,
        imageUrl: data.imageUrl ?? "",
        videoUrl: data.videoUrl ?? "",
        lowerReferenceLimit: 0,
        upperReferenceLimit: 0,
        creatorId: data.creatorId ?? -1,
        status: "CREATED"
      });
    }

    return await this.indicatorRepository.save(indicatorDraft);
  }

  async formIndicatorDraftData(indicatorId: number, data: {title?: string, description?: string, lowerReferenceLimit?: number, upperReferenceLimit?: number}) {
    const indicatorDraft = await this.indicatorRepository.findOne({where: {indicatorId, status: "CREATED"}});

    if (!indicatorDraft) {
      throw new NotFoundException("Черновик не найден!");
    }

    indicatorDraft.title = data.title ?? indicatorDraft.title;
    indicatorDraft.description = data.description ?? indicatorDraft.description;
    indicatorDraft.lowerReferenceLimit = data.lowerReferenceLimit ?? indicatorDraft.lowerReferenceLimit;
    indicatorDraft.upperReferenceLimit = data.upperReferenceLimit ?? indicatorDraft.upperReferenceLimit;
    indicatorDraft.status = "FORMED";
    indicatorDraft.formedAt = new Date();

    return await this.indicatorRepository.save(indicatorDraft);
  }

  async deleteIndicatorData(indicatorId: string) {
    await this.indicatorRepository.query(
      `UPDATE biochemical_indicators
       SET status = 'DELETED'
       WHERE indicator_id = $1`,
       [indicatorId]
    )
  }
}
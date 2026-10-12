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
    private readonly biochemicalIndicatorRepository: Repository<BiochemicalIndicator>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async getBiochemicalIndicatorFeed(indicatorId?: string, next?: string) {
    const currentId = indicatorId ? parseInt(indicatorId, 10) : 0;

    let biochemicalIndicator;

    if (next === 'true') {
      biochemicalIndicator = await this.biochemicalIndicatorRepository.findOne({
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

      if (!biochemicalIndicator) {
        biochemicalIndicator = await this.biochemicalIndicatorRepository.findOne({
          where: { status: 'FORMED' },
          order: { indicatorId: 'ASC' },
          relations: { likes: true },
        });
      }
    } 
    else if (indicatorId) {
      biochemicalIndicator = await this.biochemicalIndicatorRepository.findOne({
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
      biochemicalIndicator = await this.biochemicalIndicatorRepository.findOne({
        where: { status: 'FORMED' },
        order: { indicatorId: 'ASC' },
        relations: { likes: true },
      });
    }

    if (!biochemicalIndicator) {
      throw new NotFoundException('Показатель не найден');
    }

    return {
      biochemicalIndicator: {
        ...biochemicalIndicator,
        likesCount: biochemicalIndicator.likes ? biochemicalIndicator.likes.length : 0,
      },
    };
  }

  async getBiochemicalIndicatorGrid(indicatorConcentration?: string) {
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

    const biochemicalIndicators = await this.biochemicalIndicatorRepository.find({
      where,
      relations: {
        likes: true
      }
    });

    return {
      biochemicalIndicators: biochemicalIndicators.map((item) => ({
        ...item,
        likesCount: item.likes ? item.likes.length : 0,
      })),
      searchedConcentration: indicatorConcentration || '',
    };
  }

  async getBiochemicalIndicatorDraft() {
    const currentUserId = 1;

    return await this.biochemicalIndicatorRepository.findOne({
      where: {creatorId: currentUserId, status: "CREATED"}
    });
  }

  async createBiochemicalIndicatorDraft(title: string, imageUrl?: string, videoUrl?: string) {
    const currentUserId = 1;

    let biochemicalIndicatorDraft = await this.getBiochemicalIndicatorDraft();

    if (biochemicalIndicatorDraft) {
      biochemicalIndicatorDraft.title = title;
      biochemicalIndicatorDraft.imageUrl = imageUrl ?? "";
      biochemicalIndicatorDraft.videoUrl = videoUrl ?? "";
    }
    else {
      biochemicalIndicatorDraft = this.biochemicalIndicatorRepository.create({
        title: title,
        description: "",
        imageUrl: imageUrl ?? "",
        videoUrl: videoUrl ?? "",
        lowerReferenceLimit: 0,
        upperReferenceLimit: 0,
        creatorId: currentUserId,
        status: "CREATED"
      });
    }

    return await this.biochemicalIndicatorRepository.save(biochemicalIndicatorDraft);
  }

  async formBiochemicalIndicatorDraft(description: string, lowerReferenceLimit: number, upperReferenceLimit: number) {
    const currentUserId = 1;

    const biochemicalIndicatorDraft = await this.biochemicalIndicatorRepository.findOne({where: {creatorId: currentUserId, status: "CREATED"}});

    if (!biochemicalIndicatorDraft) {
      throw new NotFoundException("Черновик не найден!");
    }

    biochemicalIndicatorDraft.description = description ?? biochemicalIndicatorDraft.description;
    biochemicalIndicatorDraft.lowerReferenceLimit = lowerReferenceLimit ?? biochemicalIndicatorDraft.lowerReferenceLimit;
    biochemicalIndicatorDraft.upperReferenceLimit = upperReferenceLimit ?? biochemicalIndicatorDraft.upperReferenceLimit;
    biochemicalIndicatorDraft.status = "FORMED";
    biochemicalIndicatorDraft.formedAt = new Date();

    return await this.biochemicalIndicatorRepository.save(biochemicalIndicatorDraft);
  }

  async deleteBiochemicalIndicator(indicatorId: string) {
    await this.biochemicalIndicatorRepository.query(
      `UPDATE biochemical_indicators
       SET status = 'DELETED'
       WHERE indicator_id = $1`,
       [indicatorId]
    )
  }
}
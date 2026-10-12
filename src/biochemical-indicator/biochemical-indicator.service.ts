import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository, Not } from 'typeorm';

import { User } from './entities/user.entity.js';
import { BiochemicalIndicator } from './entities/biochemical-indicator.entity.js';
import { Like } from './entities/like.entity.js';
import { getCurrentUserId } from '../common/user-singleton.js';

import { formatIndicatorResponse } from './dto/indicator-response.dto.js';

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

  async getIndicatorsList(indicatorConcentration?: string) {
    const currentUserId = getCurrentUserId();
    const searchedConcentration = indicatorConcentration
      ? parseFloat(indicatorConcentration)
      : undefined;

    const isConcentrationValid = searchedConcentration !== undefined && !isNaN(searchedConcentration);

    const where: any = {
      status: 'FORMED',
      ...(isConcentrationValid && {
        lowerReferenceLimit: LessThanOrEqual(searchedConcentration),
        upperReferenceLimit: MoreThanOrEqual(searchedConcentration),
      }),
    };

    const indicators = await this.indicatorRepository.find({
      where,
      relations: { likes: true, creator: true },
      order: { indicatorId: 'DESC' },
    });

    return indicators.map((item) => formatIndicatorResponse(item, currentUserId));
  }

  async getIndicatorFeed(indicatorIdQuery?: string, next?: string) {
    const currentUserId = getCurrentUserId();
    const currentId = indicatorIdQuery ? parseInt(indicatorIdQuery, 10) : 0;
    let indicator: BiochemicalIndicator | null = null;

    if (next === 'true') {
      indicator = await this.indicatorRepository.findOne({
        where: {
          status: 'FORMED',
          indicatorId: MoreThan(currentId),
        },
        order: { indicatorId: 'ASC' },
        relations: { likes: true },
      });

      if (!indicator) {
        indicator = await this.indicatorRepository.findOne({
          where: { status: 'FORMED' },
          order: { indicatorId: 'ASC' },
          relations: { likes: true },
        });
      }
    } else if (indicatorIdQuery) {
      indicator = await this.indicatorRepository.findOne({
        where: {
          indicatorId: currentId,
          status: 'FORMED',
        },
        relations: { likes: true },
      });
    } else {
      indicator = await this.indicatorRepository.findOne({
        where: { status: 'FORMED' },
        order: { indicatorId: 'ASC' },
        relations: { likes: true },
      });
    }

    if (!indicator) {
      throw new NotFoundException();
    }

    return formatIndicatorResponse(indicator, currentUserId);
  }

  async findIndicatorDraft() {
    const currentUserId = getCurrentUserId();
    const draft = await this.indicatorRepository.findOne({
      where: { creatorId: currentUserId, status: 'CREATED' },
      relations: {likes: true}
    });

    return formatIndicatorResponse(draft, currentUserId);;
  }

  async createIndicatorDraft(
    title: string,
    imageUrl: string,
    videoUrl: string,
  ) {
    const currentUserId = getCurrentUserId();

    let indicatorDraft = await this.indicatorRepository.findOne({
      where: { creatorId: currentUserId, status: 'CREATED' },
    });

    if (indicatorDraft) {
      indicatorDraft.title = title ?? indicatorDraft.title;
      indicatorDraft.imageUrl = imageUrl ?? indicatorDraft.imageUrl;
      indicatorDraft.videoUrl = videoUrl ?? indicatorDraft.videoUrl;
    } else {
      indicatorDraft = this.indicatorRepository.create({
        title: title || '',
        description: '',
        imageUrl: imageUrl || '',
        videoUrl: videoUrl || '',
        lowerReferenceLimit: 0,
        upperReferenceLimit: 0,
        creatorId: currentUserId,
        status: 'CREATED',
      });
    }

    const saved = await this.indicatorRepository.save(indicatorDraft);
    return formatIndicatorResponse(saved, currentUserId);
  }

  async publishIndicator(
    description: string,
    lowerReferenceLimit: number,
    upperReferenceLimit: number,
  ) {
    const currentUserId = getCurrentUserId();
    const indicatorDraft = await this.indicatorRepository.findOne({
      where: { creatorId: currentUserId, status: 'CREATED' },
    });

    if (!indicatorDraft) {
      throw new NotFoundException();
    }

    indicatorDraft.description = description ?? indicatorDraft.description;
    indicatorDraft.lowerReferenceLimit = lowerReferenceLimit ?? indicatorDraft.lowerReferenceLimit;
    indicatorDraft.upperReferenceLimit = upperReferenceLimit ?? indicatorDraft.upperReferenceLimit;

    indicatorDraft.status = 'FORMED';
    indicatorDraft.formedAt = new Date();

    const saved = await this.indicatorRepository.save(indicatorDraft);
    return formatIndicatorResponse(saved, currentUserId);
  }

  async deleteIndicator(indicatorId: number) {
    const currentUserId = getCurrentUserId();
    const indicator = await this.indicatorRepository.findOne({
      where: { indicatorId },
      relations: {likes: true}
    });

    if (!indicator || indicator.status === 'DELETED') {
      throw new NotFoundException();
    }

    if (indicator.creatorId !== currentUserId) {
      throw new ForbiddenException();
    }

    indicator.status = 'DELETED';

    const saved = await this.indicatorRepository.save(indicator);
    return formatIndicatorResponse(saved, currentUserId);
  }

  async likeIndicator(indicatorId: number, isLike: number) {
    const userId = getCurrentUserId();

    const indicator = await this.indicatorRepository.findOne({
      where: { indicatorId, status: 'FORMED' },
      relations: { likes: true }
    });

    if (!indicator) {
      throw new NotFoundException();
    }

    const existingLike = await this.likeRepository.findOne({
      where: { userId, indicatorId },
    });

    if (isLike === 1) {
      if (!existingLike) {
        const newLike = this.likeRepository.create({ userId, indicatorId });
        await this.likeRepository.save(newLike);
      }
    } else {
      if (existingLike) {
        await this.likeRepository.remove(existingLike);
      }
    }

    const updatedIndicator = await this.indicatorRepository.findOne({
      where: { indicatorId },
      relations: { likes: true },
    });

    return formatIndicatorResponse(updatedIndicator, userId);
  }
}
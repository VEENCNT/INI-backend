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

import { formatBiochemicalIndicatorResponse } from './dto/biochemical-indicator-response.dto.js';

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

  async getBiochemicalIndicatorsList(
    userId: number | null,
    indicatorConcentration?: string
  ) {
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
      relations: { likes: true },
      order: { indicatorId: 'DESC' },
    });

    return indicators.map((item) => formatBiochemicalIndicatorResponse(item, userId));
  }

  async getBiochemicalIndicatorFeed(
    userId: number | null,
    indicatorId?: number, 
    next?: string
  ) {
    const currentIndicatorId = indicatorId ?? 0;
    let indicator: BiochemicalIndicator | null = null;

    if (next === 'true') {
      indicator = await this.indicatorRepository.findOne({
        where: {
          status: 'FORMED',
          indicatorId: MoreThan(currentIndicatorId),
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
    } else if (indicatorId) {
      indicator = await this.indicatorRepository.findOne({
        where: {
          indicatorId: currentIndicatorId,
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

    return formatBiochemicalIndicatorResponse(indicator, userId);
  }

  async findBiochemicalIndicatorDraft(userId: number) {
    const draft = await this.indicatorRepository.findOne({
      where: { creatorId: userId, status: 'CREATED' },
      relations: {likes: true}
    });

    return formatBiochemicalIndicatorResponse(draft, userId);;
  }

  async createBiochemicalIndicatorDraft(
    userId: number,
    title: string,
    imageUrl: string,
    videoUrl: string,
  ) {
    let indicatorDraft = await this.indicatorRepository.findOne({
      where: { creatorId: userId, status: 'CREATED' },
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
        creatorId: userId,
        status: 'CREATED',
      });
    }

    const savedIndicatorDraft = await this.indicatorRepository.save(indicatorDraft);
    return formatBiochemicalIndicatorResponse(savedIndicatorDraft, userId);
  }

  async publishBiochemicalIndicator(
    userId: number,
    description: string,
    lowerReferenceLimit: number,
    upperReferenceLimit: number,
  ) {
    const indicatorDraft = await this.indicatorRepository.findOne({
      where: { creatorId: userId, status: 'CREATED' },
    });

    if (!indicatorDraft) {
      throw new NotFoundException();
    }

    indicatorDraft.description = description ?? indicatorDraft.description;
    indicatorDraft.lowerReferenceLimit = lowerReferenceLimit ?? indicatorDraft.lowerReferenceLimit;
    indicatorDraft.upperReferenceLimit = upperReferenceLimit ?? indicatorDraft.upperReferenceLimit;

    indicatorDraft.status = 'FORMED';
    indicatorDraft.formedAt = new Date();

    const savedIndicatorDraft = await this.indicatorRepository.save(indicatorDraft);
    return formatBiochemicalIndicatorResponse(savedIndicatorDraft, userId);
  }

  async deleteBiochemicalIndicator(
    userId: number,
    indicatorId: number
  ) {
    const indicator = await this.indicatorRepository.findOne({
      where: { indicatorId },
      relations: {likes: true}
    });

    if (!indicator || indicator.status === 'DELETED') {
      throw new NotFoundException();
    }

    if (indicator.creatorId !== userId) {
      throw new ForbiddenException();
    }

    indicator.status = 'DELETED';

    const savedIndicator = await this.indicatorRepository.save(indicator);
    return formatBiochemicalIndicatorResponse(savedIndicator, userId);
  }

  async likeBiochemicalIndicator(
    userId: number,
    indicatorId: number, 
    isLike: number
  ) {
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

    return formatBiochemicalIndicatorResponse(updatedIndicator, userId);
  }
}
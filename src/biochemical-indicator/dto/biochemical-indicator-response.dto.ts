import { ApiProperty } from '@nestjs/swagger';
import { BiochemicalIndicator } from '../entities/biochemical-indicator.entity.js';

export class BiochemicalIndicatorResponseDto {
  @ApiProperty({ example: 1, nullable: true })
  indicatorId: number | null;

  @ApiProperty({ example: 'Лимфоциты' })
  title: string;

  @ApiProperty({ example: 'Описание показателя' })
  description: string;

  @ApiProperty({ example: 3.5 })
  lowerReferenceLimit: number;

  @ApiProperty({ example: 6.1 })
  upperReferenceLimit: number;

  @ApiProperty({ example: 'http://minio/.../img.png' })
  imageUrl: string;

  @ApiProperty({ example: 'http://minio/.../vid.mp4' })
  videoUrl: string;

  @ApiProperty({ example: 10 })
  creatorId: number | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date | null;

  @ApiProperty({ example: '2024-01-02T00:00:00.000Z', nullable: true })
  formedAt: Date | null;

  @ApiProperty({ example: 1, description: '1, если текущий пользователь — автор' })
  isOwner: number;

  @ApiProperty({ example: 1, description: '1, если текущий пользователь лайкнул' })
  isLiked: number;

  @ApiProperty({ example: 5 })
  likesCount: number;
}

export function formatBiochemicalIndicatorResponse(
  indicator: BiochemicalIndicator | null,
  currentUserId: number | null,
): BiochemicalIndicatorResponseDto {
  if (!indicator) {
    return {
      indicatorId: null,
      title: '',
      description: '',
      lowerReferenceLimit: 0,
      upperReferenceLimit: 0,
      imageUrl: '',
      videoUrl: '',
      creatorId: null,
      createdAt: null,
      formedAt: null,
      isOwner: 0,
      isLiked: 0,
      likesCount: 0,
    };
  }

  return {
    indicatorId: indicator.indicatorId ?? null,
    title: indicator.title ?? '',
    description: indicator.description ?? '',
    lowerReferenceLimit:
      indicator.lowerReferenceLimit !== null && indicator.lowerReferenceLimit !== undefined
        ? Number(indicator.lowerReferenceLimit)
        : 0,
    upperReferenceLimit:
      indicator.upperReferenceLimit !== null && indicator.upperReferenceLimit !== undefined
        ? Number(indicator.upperReferenceLimit)
        : 0,
    imageUrl: indicator.imageUrl ?? '',
    videoUrl: indicator.videoUrl ?? '',
    creatorId: indicator.creatorId ?? null,
    createdAt: indicator.createdAt ?? null,
    formedAt: indicator.formedAt ?? null,
    isOwner: indicator.creatorId === currentUserId ? 1 : 0,
    isLiked: indicator.likes && indicator.likes.some((like) => like.userId === currentUserId) ? 1 : 0,
    likesCount: indicator.likes ? indicator.likes.length : 0
  };
}
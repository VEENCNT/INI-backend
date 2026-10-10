import { BiochemicalIndicator } from '../entities/biochemical-indicator.entity.js';

export function formatIndicatorResponse(
  indicator: BiochemicalIndicator | null,
  currentUserId: number,
) {
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
    isLiked: indicator.likes.some((like) => like.userId === currentUserId) ? 1 : 0,
    likesCount: indicator.likes ? indicator.likes.length : 0
  };
}
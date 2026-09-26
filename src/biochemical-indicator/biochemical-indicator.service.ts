import { Injectable } from '@nestjs/common';

const MINIO_BASE_URL = 'http://localhost:9000/media';

export interface BiochemicalIndicator {
  indicatorId: number;
  indicatorTitle: string;
  indicatorDescription: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
  imageUrl: string;
  videoUrl: string;
  patientLikeUserIds: number[];
}

@Injectable()
export class BiochemicalIndicatorService {
  private readonly biochemicalIndicators: BiochemicalIndicator[] = [
    {
      indicatorId: 1,
      indicatorTitle: 'Крайне низкий Альбумин',
      indicatorDescription: 'Серьезный дефицит основного белка крови.',
      lowerReferenceLimit: 0,
      upperReferenceLimit: 25,
      imageUrl: `${MINIO_BASE_URL}/albumin.png`,
      videoUrl: `${MINIO_BASE_URL}/albumin.mp4`,
      patientLikeUserIds: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      indicatorId: 2,
      indicatorTitle: 'Низкое число Лимфоцитов',
      indicatorDescription: 'Снижение уровня лимфоцитов, указывающее на иммунодефицит и нутритивный риск.',
      lowerReferenceLimit: 800,
      upperReferenceLimit: 1200,
      imageUrl: `${MINIO_BASE_URL}/lymphocytes.png`,
      videoUrl: `${MINIO_BASE_URL}/lymphocytes.mp4`,
      patientLikeUserIds: [8, 9, 10, 11],
    },
    {
      indicatorId: 3,
      indicatorTitle: 'Нормальный Альбумин',
      indicatorDescription: 'Оптимальный уровень сывороточного альбумина.',
      lowerReferenceLimit: 35,
      upperReferenceLimit: 50,
      imageUrl: `${MINIO_BASE_URL}/albumin.png`,
      videoUrl: `${MINIO_BASE_URL}/albumin.mp4`,
      patientLikeUserIds: [12, 13, 14, 15, 16],
    },
    {
      indicatorId: 4,
      indicatorTitle: 'Нормальный Холестерин',
      indicatorDescription: 'Уровень общего холестерина в норме для расчета INI.',
      lowerReferenceLimit: 4.5,
      upperReferenceLimit: 5.2,
      imageUrl: `${MINIO_BASE_URL}/cholesterol.png`,
      videoUrl: `${MINIO_BASE_URL}/cholesterol.mp4`,
      patientLikeUserIds: [17, 18, 19],
    },
  ];

  getIndicatorFeedData(indicatorIdQuery?: string, next?: string) {
    let indicatorId = 0;

    if (indicatorIdQuery) {
      const parsedId = parseInt(indicatorIdQuery, 10);
      const foundId = this.biochemicalIndicators.findIndex(
        (item) => item.indicatorId === parsedId,
      );
      if (foundId !== -1) {
        indicatorId = foundId;
      }
    }

    if (next === 'true') {
      indicatorId = (indicatorId + 1) % this.biochemicalIndicators.length;
    }

    const currentIndicator = this.biochemicalIndicators[indicatorId];

    return {
      biochemicalIndicator: {
        ...currentIndicator,
        likesCount: currentIndicator.patientLikeUserIds.length,
      }
    };
  }

  getIndicatorGridData(indicatorConcentration?: string) {
    let filteredIndicators = this.biochemicalIndicators;
    const searchedConcentration = indicatorConcentration
      ? parseFloat(indicatorConcentration)
      : undefined;

    if (searchedConcentration !== undefined && !isNaN(searchedConcentration)) {
      filteredIndicators = filteredIndicators.filter(
        (item) =>
          searchedConcentration >= item.lowerReferenceLimit &&
          searchedConcentration <= item.upperReferenceLimit,
      );
    }

    return {
      biochemicalIndicators: filteredIndicators.map((item) => ({
        ...item,
        likesCount: item.patientLikeUserIds.length,
      })),
      searchedConcentration: indicatorConcentration || ''
    };
  }
}
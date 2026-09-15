import { Injectable } from '@nestjs/common';

const MINIO_BASE_URL = 'http://localhost:9000/media';

export interface BiochemicalIndicator {
  indicatorId: number;
  indicatorTitle: string;
  clinicalDescription: string;
  indicatorName: string;
  measurementUnit: string;
  lowerReferenceLimit: number;
  upperReferenceLimit: number;
  imageKey: string;
  videoKey: string;
  registrationDate: string;
  patientLikeUserIds: number[];
}

@Injectable()
export class BiochemicalIndicatorService {
  private readonly biochemicalIndicatorsCollection: BiochemicalIndicator[] = [
    {
      indicatorId: 1,
      indicatorTitle: 'Крайне низкий Альбумин',
      clinicalDescription: 'Серьезный дефицит основного белка крови.',
      indicatorName: 'Альбумин',
      measurementUnit: 'г/л',
      lowerReferenceLimit: 0,
      upperReferenceLimit: 25,
      imageKey: 'albumin.png',
      videoKey: 'albumin.mp4',
      registrationDate: '2026-01-15',
      patientLikeUserIds: Array.from({ length: 2931 }, (_, i) => i + 1),
    },
    {
      indicatorId: 2,
      indicatorTitle: 'Низкое число Лимфоцитов',
      clinicalDescription: 'Снижение уровня лимфоцитов, указывающее на иммунодефицит и нутритивный риск.',
      indicatorName: 'Лимфоциты',
      measurementUnit: 'кл/мкл',
      lowerReferenceLimit: 800,
      upperReferenceLimit: 1200,
      imageKey: 'lymphocytes.png',
      videoKey: 'lymphocytes.mp4',
      registrationDate: '2026-02-01',
      patientLikeUserIds: Array.from({ length: 1230 }, (_, i) => i + 1),
    },
    {
      indicatorId: 3,
      indicatorTitle: 'Нормальный Альбумин',
      clinicalDescription: 'Оптимальный уровень сывороточного альбумина.',
      indicatorName: 'Альбумин',
      measurementUnit: 'г/л',
      lowerReferenceLimit: 35,
      upperReferenceLimit: 50,
      imageKey: 'albumin.png',
      videoKey: 'albumin.mp4',
      registrationDate: '2026-01-16',
      patientLikeUserIds: Array.from({ length: 1830 }, (_, i) => i + 1),
    },
    {
      indicatorId: 4,
      indicatorTitle: 'Нормальный Холестерин',
      clinicalDescription: 'Уровень общего холестерина в норме для расчета INI.',
      indicatorName: 'Холестерин',
      measurementUnit: 'ммоль/л',
      lowerReferenceLimit: 4.5,
      upperReferenceLimit: 5.2,
      imageKey: 'cholesterol.png',
      videoKey: 'cholesterol.mp4',
      registrationDate: '2026-02-10',
      patientLikeUserIds: Array.from({ length: 1830 }, (_, i) => i + 1),
    },
  ];

  getIndicatorFeedData(indicatorIdQuery?: string, next?: string) {
    let index = 0;

    if (indicatorIdQuery) {
      const parsedId = parseInt(indicatorIdQuery, 10);
      const foundIdx = this.biochemicalIndicatorsCollection.findIndex(
        (item) => item.indicatorId === parsedId,
      );
      if (foundIdx !== -1) {
        index = foundIdx;
      }
    }

    if (next === 'true') {
      index = (index + 1) % this.biochemicalIndicatorsCollection.length;
    }

    const currentIndicator = this.biochemicalIndicatorsCollection[index];

    return {
      biochemicalIndicator: {
        ...currentIndicator,
        likesCount: currentIndicator.patientLikeUserIds.length,
        indicatorImageUrl: `${MINIO_BASE_URL}/${currentIndicator.imageKey}`,
        indicatorVideoUrl: `${MINIO_BASE_URL}/${currentIndicator.videoKey}`,
      },
      activeTab: 'feed',
    };
  }

  getIndicatorsGridData(bloodSubstanceConcentrationQuery?: string) {
    let filteredIndicators = this.biochemicalIndicatorsCollection;
    const searchConcentration = bloodSubstanceConcentrationQuery
      ? parseFloat(bloodSubstanceConcentrationQuery)
      : undefined;

    if (searchConcentration !== undefined && !isNaN(searchConcentration)) {
      filteredIndicators = filteredIndicators.filter(
        (item) =>
          searchConcentration >= item.lowerReferenceLimit &&
          searchConcentration <= item.upperReferenceLimit,
      );
    }

    return {
      biochemicalIndicators: filteredIndicators.map((item) => ({
        ...item,
        likesCount: item.patientLikeUserIds.length,
        indicatorImageUrl: `${MINIO_BASE_URL}/${item.imageKey}`,
        indicatorVideoUrl: `${MINIO_BASE_URL}/${item.videoKey}`,
      })),
      searchedConcentrationValue: bloodSubstanceConcentrationQuery || '',
      activeTab: 'grid',
    };
  }
}
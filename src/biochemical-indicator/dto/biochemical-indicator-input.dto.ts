import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBiochemicalIndicatorDraftDto {
  @ApiProperty({ example: 'Лимфоциты' })
  title: string;
}

export class PublishBiochemicalIndicatorDto {
  @ApiProperty({ example: 'Описание' })
  description: string;

  @ApiProperty({ example: '3.5' })
  @Transform(({ value }) => Number(value))
  lowerReferenceLimit: number;

  @ApiProperty({ example: '6.1' })
  @Transform(({ value }) => Number(value))
  upperReferenceLimit: number;
}

export class LikeBiochemicalIndicatorDto {
  @ApiProperty({ example: 1, description: '1 — поставить лайк, 0 — убрать' })
  @Transform(({ value }) => Number(value))
  like: number;
}
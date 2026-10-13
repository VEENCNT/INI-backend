import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from 'class-transformer'

export class BiochemicalIndicatorListQueryDto {
  @ApiPropertyOptional({ example: '5.5' })
  indicatorConcentration?: string;
}

export class BiochemicalIndicatorFeedQueryDto {
  @ApiPropertyOptional({ example: '10' })
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  indicatorId?: number;

  @ApiPropertyOptional({ example: 'true' })
  next?: string;
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateBiochemicalIndicatorDto } from './create-biochemical-indicator.dto.js';

export class UpdateBiochemicalIndicatorDto extends PartialType(CreateBiochemicalIndicatorDto) {}

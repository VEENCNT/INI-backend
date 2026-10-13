import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedGuard } from './auth.guard.js';

export const Authenticated = () =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthenticatedGuard));
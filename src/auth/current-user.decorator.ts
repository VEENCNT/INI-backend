import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (options: { required?: boolean } = {}, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.session?.userId ?? null;

    if (!userId && options.required) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return userId;
  },
);
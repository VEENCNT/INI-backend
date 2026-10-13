import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'alice', description: 'Логин пользователя' })
  login: string;

  @ApiProperty({ example: '1234', description: 'Пароль' })
  passwordHash: string;
}
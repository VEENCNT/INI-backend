import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alice', description: 'Логин пользователя' })
  login: string;

  @ApiProperty({ example: '1234', description: 'Пароль' })
  passwordHash: string;
}
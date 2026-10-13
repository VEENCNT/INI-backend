import { Controller, Post, Body, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../biochemical-indicator/entities/user.entity.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Зарегистрировать нового пользователя' })
  async registerUser(
    @Body() body: RegisterDto
  ) {
    const { login, passwordHash } = body

    const existing = await this.userRepository.findOne({ where: { login } });
    
    if (existing) {
      throw new BadRequestException();
    }

    const newUser = this.userRepository.create({
      login,
      passwordHash,
    });

    const savedUser = await this.userRepository.save(newUser);
    
    return {
      userId: savedUser.userId,
      login: savedUser.login
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Войти в систему' })
  async login(
    @Body() body: LoginDto,
    @Req() req: any
  ) {
    const { login, passwordHash } = body;

    const user = await this.userRepository.findOne({ where: { login } });

    if (!user || user.passwordHash !== passwordHash) {
      throw new UnauthorizedException();
    }

    req.session.userId = user.userId;
    
    return { 
      userId: user.userId, 
      login: user.login 
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выйти из системы' })
  async logout(@Req() req: any) {
    req.session.destroy();
    return {};
  }
}
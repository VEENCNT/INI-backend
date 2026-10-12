import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../biochemical-indicator/entities/user.entity.js';

@Controller('api')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('auth/register')
  async registerUser(
    @Body('login') login: string,
    @Body('passwordHash') passwordHash: string
  ) {
    const newUser = this.userRepository.create({
      login,
      passwordHash: passwordHash ?? 'default_password', 
    });

    const savedUser = await this.userRepository.save(newUser);
    
    return {
      userId: savedUser.userId,
      login: savedUser.login
    };
  }

  @Post('auth/login')
  async login() {
    return {};
  }

  @Post('auth/logout')
  async logout() {
    return {};
  }
}
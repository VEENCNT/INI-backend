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
  async registerUser(@Body() body: { username: string; login: string; passwordHash: string }) {
    const newUser = this.userRepository.create({
      username: body.username,
      login: body.login,
      passwordHash: body.passwordHash || 'default_password', 
    });
    const savedUser = await this.userRepository.save(newUser);
    return {
      userId: savedUser.userId,
      username: savedUser.username,
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
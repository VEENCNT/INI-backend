import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm';
import { BiochemicalIndicator } from './biochemical-indicator.entity.js';
import { Like } from './like.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  login: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @OneToMany(() => BiochemicalIndicator, (indicator) => indicator.creator)
  indicators: Relation<BiochemicalIndicator[]>;

  @OneToMany(() => Like, (like) => like.user)
  likes: Relation<Like[]>;
}
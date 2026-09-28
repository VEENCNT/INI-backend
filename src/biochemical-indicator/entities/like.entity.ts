import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  Unique,
  type Relation
} from 'typeorm';
import { User } from './user.entity.js';
import { BiochemicalIndicator } from './biochemical-indicator.entity.js';

@Entity('likes')
@Unique(['userId', 'indicatorId'])
export class Like {
  @PrimaryGeneratedColumn({ name: 'like_id' })
  likeId: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'indicator_id', type: 'int' })
  indicatorId: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => BiochemicalIndicator, (indicator) => indicator.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'indicator_id' })
  indicator: Relation<BiochemicalIndicator>;
}
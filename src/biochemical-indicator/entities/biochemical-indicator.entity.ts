import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn,
  type Relation
} from 'typeorm';
import { User } from './user.entity.js';
import { Like } from './like.entity.js';

@Entity('biochemical_indicators')
export class BiochemicalIndicator {
  @PrimaryGeneratedColumn({ name: 'indicator_id' })
  indicatorId: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'lower_reference_limit', type: 'numeric', precision: 10, scale: 2  })
  lowerReferenceLimit: number;

  @Column({ name: 'upper_reference_limit', type: 'numeric', precision: 10, scale: 2  })
  upperReferenceLimit: number;

  @Column({ name: 'image_url', type: 'varchar', length: 255})
  imageUrl: string;

  @Column({ name: 'video_url', type: 'varchar', length: 255})
  videoUrl: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'creator_id', type: 'int' })
  creatorId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'formed_at', type: 'timestamp', nullable: true })
  formedAt: Date;

  @ManyToOne(() => User, (user) => user.indicators, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: Relation<User>;

  @OneToMany(() => Like, (like) => like.indicator)
  likes: Relation<Like[]>;
}
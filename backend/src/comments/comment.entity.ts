import { Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  content?: string;
  songId?: string;
  userId?: string;
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

export interface Emoji {
  name: string;
  emoji: string;
  count: number;
}

export interface DraftJsBlock {
  key: string;
  text: string;
  type: string;
  depth: number;
  data: Record<string, unknown>;
  entityRanges: Array<Record<string, unknown>>;
  inlineStyleRanges: Array<Record<string, unknown>>;
}

export interface UiData {
  blocks: DraftJsBlock[];
  entityMap: Record<string, unknown>;
}

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'bigint', nullable: true })
  time: number | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  emojies: Emoji[];

  @Column({ type: 'jsonb', nullable: true })
  richUiData: UiData | null;
}

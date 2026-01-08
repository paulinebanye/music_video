import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CommentEntity, Emoji, UiData } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  findAll() {}

  async create(dto: CreateCommentDto): Promise<CommentEntity> {
    const payload: DeepPartial<CommentEntity> = {
      message: dto.message,
      username: dto.username ?? null,
      userId: dto.userId ?? null,
      imageUrl: dto.imageUrl ?? null,
      time: dto.time ?? null,
      emojies: this.mapEmojies(dto.emojies),
      richUiData: this.mapUiData(dto.richUiData),
    };

    const comment = this.commentRepository.create(payload);
    return this.commentRepository.save(comment);
  }

  private mapEmojies(emojies?: CreateCommentDto['emojies']): Emoji[] {
    if (!emojies?.length) {
      return [];
    }

    return emojies.map((emoji) => ({
      name: emoji.name,
      emoji: emoji.emoji,
      count: emoji.count,
    }));
  }

  private mapUiData(uiData?: CreateCommentDto['richUiData']): UiData | null {
    if (!uiData) {
      return null;
    }

    return {
      blocks: uiData.blocks.map((block) => ({
        key: block.key,
        text: block.text,
        type: block.type,
        depth: block.depth,
        data: block.data ?? {},
        entityRanges: block.entityRanges?.map((range) => ({ ...range })) ?? [],
        inlineStyleRanges:
          block.inlineStyleRanges?.map((styleRange) => ({ ...styleRange })) ?? [],
      })),
      entityMap: uiData.entityMap ?? {},
    };
  }

  update() {}

  remove() {}
}

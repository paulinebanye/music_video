import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CommentEntity, Emoji, UiData } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments.query.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  findAll(query: ListCommentsQueryDto): Promise<CommentEntity[]> {
    const { page = 1, limit = 20, userId, username, sortBy = 'createdAt', order = 'DESC' } = query;

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    }

    if (username) {
      where.username = username;
    }

    return this.commentRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { [sortBy]: order },
    });
  }

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

  async update(id: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }

    if (dto.message !== undefined) {
      comment.message = dto.message;
    }

    if (dto.username !== undefined) {
      comment.username = dto.username;
    }

    if (dto.userId !== undefined) {
      comment.userId = dto.userId;
    }

    if (dto.imageUrl !== undefined) {
      comment.imageUrl = dto.imageUrl;
    }

    if (dto.time !== undefined) {
      comment.time = dto.time;
    }

    if (dto.emojies !== undefined) {
      comment.emojies = this.mapEmojies(dto.emojies);
    }

    if (dto.richUiData !== undefined) {
      comment.richUiData = this.mapUiData(dto.richUiData);
    }

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

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment with id "${id}" not found`);
    }

    await this.commentRepository.remove(comment);
  }
}

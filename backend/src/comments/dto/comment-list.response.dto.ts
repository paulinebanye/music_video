import { ApiProperty } from '@nestjs/swagger';
import { CommentEntity } from '../comment.entity';
import { PaginationMetaDto } from './pagination-meta.dto';

export class CommentListResponseDto {
  @ApiProperty({ type: () => [CommentEntity] })
  data!: CommentEntity[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}

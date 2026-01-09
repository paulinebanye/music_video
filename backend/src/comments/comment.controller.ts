import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './comment.entity';
import { ListCommentsQueryDto } from './dto/list-comments.query.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOkResponse({ description: 'Paginated list of comments', type: [CommentEntity] })
  findAll(@Query() query: ListCommentsQueryDto): Promise<CommentEntity[]> {
    return this.commentService.findAll(query);
  }

  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiOkResponse({ description: 'Comment created successfully', type: CommentEntity })
  create(@Body() dto: CreateCommentDto): Promise<CommentEntity> {
    return this.commentService.create(dto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({ description: 'Comment updated successfully', type: CommentEntity })
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto): Promise<CommentEntity> {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Comment deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.commentService.remove(id);
  }
}

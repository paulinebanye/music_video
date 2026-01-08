import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll() {}

  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiOkResponse({ description: 'Comment created successfully', type: CommentEntity })
  create(@Body() dto: CreateCommentDto): Promise<CommentEntity> {
    return this.commentService.create(dto);
  }

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}

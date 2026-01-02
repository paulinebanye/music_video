import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll() {}

  @Post()
  create() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}

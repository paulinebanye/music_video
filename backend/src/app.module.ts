import { Module } from '@nestjs/common';
import { PluginInfoModule } from './plugin-info/plugin-info.module';
import { CommentModule } from './comments/comment.module';

@Module({
  imports: [PluginInfoModule, CommentModule],
})
export class AppModule {}

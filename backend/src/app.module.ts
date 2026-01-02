import { Module } from '@nestjs/common';
import { PluginInfoModule } from './plugin-info/plugin-info.module';
import { CommentModule } from './comments/comment.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [LoggerModule, PluginInfoModule, CommentModule],
})
export class AppModule {}

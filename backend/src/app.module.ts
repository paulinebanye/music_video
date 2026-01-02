import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginInfoModule } from './plugin-info/plugin-info.module';
import { CommentModule } from './comments/comment.module';
import { LoggerModule } from './common/logger/logger.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    LoggerModule,
    PluginInfoModule,
    CommentModule,
  ],
})
export class AppModule {}

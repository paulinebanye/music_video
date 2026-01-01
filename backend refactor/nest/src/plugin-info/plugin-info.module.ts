import { Module } from '@nestjs/common';
import { PluginInfoController } from './plugin-info.controller';
import { PluginInfoService } from './plugin-info.service';

@Module({
  controllers: [PluginInfoController],
  providers: [PluginInfoService],
})
export class PluginInfoModule {}

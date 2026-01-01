import { Module } from '@nestjs/common';
import { PluginInfoModule } from './plugin-info/plugin-info.module';

@Module({
  imports: [PluginInfoModule],
})
export class AppModule {}

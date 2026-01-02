import { Module } from '@nestjs/common';
import { PluginInfoController } from './plugin-info.controller';
import { PluginInfoService } from './plugin-info.service';
import { RequestClient } from '../infrastructure/clients/request-client';
import { AxiosRequestClient } from '../infrastructure/clients/axios-request.client';

@Module({
  controllers: [PluginInfoController],
  providers: [
    PluginInfoService,
    {
      provide: RequestClient,
      useClass: AxiosRequestClient,
    },
  ],
})
export class PluginInfoModule {}

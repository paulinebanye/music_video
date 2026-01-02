import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { PluginInfoService } from './plugin-info.service';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';
import { PluginPingResponseDto } from './dto/plugin-ping-response.dto';

@Controller('api/v1/music')
export class PluginInfoController {
  constructor(private readonly pluginInfoService: PluginInfoService) {}

  @Get()
  getPluginInfo(): PluginInfoResponseDto {
    return this.pluginInfoService.getPluginInfo();
  }

  @Get('ping')
  @ApiOkResponse({
    type: PluginPingResponseDto,
    description: 'Upstream music server status report',
  })
  @ApiResponse({
    status: 424,
    description: 'The music.zuri.chat server is unavailable',
  })
  ping(): Promise<PluginPingResponseDto> {
    return this.pluginInfoService.ping();
  }
}

import { Body, Controller, Delete, Get, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { PluginInfoService } from './plugin-info.service';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';
import { PluginPingResponseDto } from './dto/plugin-ping-response.dto';
import {
  PluginInstallRequestDto,
  PluginInstallResponseDto,
} from './dto/plugin-install.dto';
import {
  PluginUninstallRequestDto,
  PluginUninstallResponseDto,
} from './dto/plugin-uninstall.dto';

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

  @Post('install')
  @ApiBody({ type: PluginInstallRequestDto })
  @ApiOkResponse({
    type: PluginInstallResponseDto,
    description: 'Plugin successfully installed',
  })
  @ApiResponse({
    status: 424,
    description: 'Upstream installation dependency failed',
  })
  install(
    @Body() dto: PluginInstallRequestDto,
    @Headers('authorization') authorization: string,
  ): Promise<PluginInstallResponseDto> {
    const pluginId = process.env.PLUGIN_ID ?? '';
    return this.pluginInfoService.install(dto, authorization, pluginId);
  }

  @Delete('install')
  @ApiBody({ type: PluginUninstallRequestDto })
  @ApiOkResponse({
    type: PluginUninstallResponseDto,
    description: 'Plugin successfully uninstalled',
  })
  @ApiResponse({
    status: 424,
    description: 'Upstream uninstallation dependency failed',
  })
  uninstall(
    @Body() dto: PluginUninstallRequestDto,
    @Headers('authorization') authorization: string,
  ): Promise<PluginUninstallResponseDto> {
    const pluginId = process.env.PLUGIN_ID ?? '';
    return this.pluginInfoService.uninstall(dto, authorization, pluginId);
  }
}

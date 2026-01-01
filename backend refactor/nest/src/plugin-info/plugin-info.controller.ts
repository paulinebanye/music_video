import { Controller, Get } from '@nestjs/common';
import { PluginInfoService } from './plugin-info.service';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';

@Controller('music/api/v1')
export class PluginInfoController {
  constructor(private readonly pluginInfoService: PluginInfoService) {}

  @Get('info')
  getPluginInfo(): PluginInfoResponseDto {
    return this.pluginInfoService.getPluginInfo();
  }
}

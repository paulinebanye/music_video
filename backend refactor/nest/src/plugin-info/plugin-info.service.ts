import { Injectable } from '@nestjs/common';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';

@Injectable()
export class PluginInfoService {
  getPluginInfo(): PluginInfoResponseDto {
    throw new Error('Not yet implemented');
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';
import { PluginPingResponseDto } from './dto/plugin-ping-response.dto';
import { RequestClient } from '../infrastructure/clients/request-client';

@Injectable()
export class PluginInfoService {
  private readonly pingUrl = 'https://music.zuri.chat/music';

  constructor(private readonly requestClient: RequestClient) {}

  getPluginInfo(): PluginInfoResponseDto {
    return {
      message: 'Plugin Information Retrieved',
      data: {
        type: 'Plugin Information',
        plugin_info: {
          name: 'Music room',
          description: [
            'This is a plugin that allows individuals in an organization to add music and video links from YouTube to a  shared playlist. Users also have the option to chat with other users in the music room and the option to like a song or video that is in the music room library.',
          ],
        },
        version: 'v1',
        scaffold_structure: 'Monolith',
        team: 'HNG 8.0/Team Music Plugin',
        developer_name: 'Music Plugin',
        developer_email: 'musicplugin@zurichat.com',
        icon_url: 'https://svgshare.com/i/aXm.svg',
        photos: 'https://svgshare.com/i/aXm.svg',
        homepage_url: 'https://zuri.chat/music',
        sidebar_url: 'https://zuri.chat/api/v1/sidebar',
        install_url: 'https://zuri.chat/music',
        ping_url: 'http://zuri.chat/music/api/v1/ping',
      },
      success: 'true',
    };
  }

  async ping(): Promise<PluginPingResponseDto> {
    const failurePayload: PluginPingResponseDto = {
      server: [
        {
          status: 'Failed',
          Report: ['The music.zuri.chat server is not working'],
        },
      ],
    };

    try {
      const response = await this.requestClient.send<PluginPingResponseDto>({
        url: this.pingUrl,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.statusCode === HttpStatus.OK && response.data) {
        return response.data;
      }

      throw new HttpException(response.data ?? failurePayload, HttpStatus.FAILED_DEPENDENCY);
    } catch (error) {
      throw new HttpException(failurePayload, HttpStatus.FAILED_DEPENDENCY, {
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}

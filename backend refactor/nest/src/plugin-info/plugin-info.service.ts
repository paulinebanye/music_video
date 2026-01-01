import { Injectable } from '@nestjs/common';
import { PluginInfoResponseDto } from './dto/plugin-info-response.dto';

@Injectable()
export class PluginInfoService {
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
}

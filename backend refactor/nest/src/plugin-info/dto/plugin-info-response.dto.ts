import { Expose } from 'class-transformer';

export class PluginInfoResponseDto {
  @Expose()
  message!: string;

  @Expose()
  data!: {
    type: string;
    plugin_info: {
      name: string;
      description: string[];
    };
    version: string;
    scaffold_structure?: string;
    team?: string;
    developer_name?: string;
    developer_email?: string;
    icon_url?: string;
    photos?: string;
    homepage_url?: string;
    sidebar_url?: string;
    install_url?: string;
    ping_url?: string;
  };

  @Expose()
  success!: string;
}

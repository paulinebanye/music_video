import { Test, TestingModule } from '@nestjs/testing';
import { PluginInfoController } from '../../src/plugin-info/plugin-info.controller';
import { PluginInfoService } from '../../src/plugin-info/plugin-info.service';
import { PluginInfoResponseDto } from '../../src/plugin-info/dto/plugin-info-response.dto';

describe('PluginInfoController', () => {
  let controller: PluginInfoController;
  let service: jest.Mocked<PluginInfoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PluginInfoController],
      providers: [
        {
          provide: PluginInfoService,
          useValue: {
            getPluginInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PluginInfoController>(PluginInfoController);
    service = module.get(PluginInfoService) as jest.Mocked<PluginInfoService>;
  });

  describe('getPluginInfo', () => {
    it('should return the payload provided by the service', () => {
      const payload: PluginInfoResponseDto = {
        message: 'Plugin Information Retrieved',
        success: 'true',
        data: {
          type: 'Plugin Information',
          plugin_info: {
            name: 'Music room',
            description: ['desc'],
          },
          version: 'v1',
          scaffold_structure: 'Monolith',
          team: 'team',
          developer_name: 'dev',
          developer_email: 'dev@email.com',
          icon_url: 'icon',
          photos: 'photo',
          homepage_url: 'https://zuri.chat/music',
          sidebar_url: 'https://zuri.chat/api/v1/sidebar',
          install_url: 'https://zuri.chat/music',
          ping_url: 'http://zuri.chat/music/api/v1/ping',
        },
      };
      service.getPluginInfo.mockReturnValue(payload);

      const result = controller.getPluginInfo();

      expect(result).toBe(payload);
      expect(service.getPluginInfo).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors thrown by the service', () => {
      const error = new Error('Service failure');
      service.getPluginInfo.mockImplementation(() => {
        throw error;
      });

      expect(() => controller.getPluginInfo()).toThrow(error);
      expect(service.getPluginInfo).toHaveBeenCalledTimes(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PluginInfoService } from '../../src/plugin-info/plugin-info.service';
import { RequestClient } from '../../src/infrastructure/clients/request-client';

describe('PluginInfoService', () => {
  let service: PluginInfoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PluginInfoService,
        {
          provide: RequestClient,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PluginInfoService>(PluginInfoService);
  });

  describe('getPluginInfo', () => {
    it('should return the expected plugin metadata payload', () => {
      const result = service.getPluginInfo();

      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          message: 'Plugin Information Retrieved',
          success: 'true',
          data: expect.objectContaining({
            type: 'Plugin Information',
            plugin_info: expect.objectContaining({
              name: 'Music room',
              description: expect.arrayContaining([expect.any(String)]),
            }),
            version: 'v1',
            homepage_url: 'https://zuri.chat/music',
            install_url: 'https://zuri.chat/music',
            ping_url: 'http://zuri.chat/music/api/v1/ping',
            sidebar_url: 'https://zuri.chat/api/v1/sidebar',
          }),
        }),
      );
    });

    it('should never return null or undefined', () => {
      const result = service.getPluginInfo();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it('should expose required top-level fields without throwing', () => {
      expect(() => service.getPluginInfo()).not.toThrow();
      const result = service.getPluginInfo();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('success');
    });
  });
});

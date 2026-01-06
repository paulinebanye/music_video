import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PluginInfoService } from '../../src/plugin-info/plugin-info.service';
import { RequestClient } from '../../src/infrastructure/clients/request-client';

describe('PluginInfoService', () => {
  let service: PluginInfoService;
  let requestClient: { send: jest.Mock };

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
    requestClient = module.get(RequestClient);
  });

  beforeEach(() => {
    requestClient.send.mockReset();
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

  describe('ping', () => {
    it('should return upstream data when the health check succeeds', async () => {
      const payload = {
        server: [
          {
            status: 'Success',
            Report: ['The music.zuri.chat server is working'],
          },
        ],
      };

      requestClient.send.mockResolvedValue({
        statusCode: 200,
        headers: {},
        data: payload,
      });

      await expect(service.ping()).resolves.toEqual(payload);
      expect(requestClient.send).toHaveBeenCalledWith({
        url: 'https://music.zuri.chat/music',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should throw HttpException when upstream returns non-200', async () => {
      requestClient.send.mockResolvedValue({
        statusCode: 500,
        headers: {},
        data: undefined,
      });

      await expect(service.ping()).rejects.toBeInstanceOf(HttpException);
      await expect(service.ping()).rejects.toHaveProperty('status', HttpStatus.FAILED_DEPENDENCY);
    });

    it('should throw HttpException with fallback payload when request fails', async () => {
      requestClient.send.mockRejectedValue(new Error('network failure'));

      await expect(service.ping()).rejects.toBeInstanceOf(HttpException);
      await expect(service.ping()).rejects.toMatchObject({
        status: HttpStatus.FAILED_DEPENDENCY,
        response: {
          server: [
            {
              status: 'Failed',
              Report: ['The music.zuri.chat server is not working'],
            },
          ],
        },
      });
    });
  });

  describe('install', () => {
    const dto = {
      user_id: 'user-1',
      organisation_id: 'org-1',
    };
    const authToken = 'Bearer token';
    const pluginId = 'plugin-42';

    it('should return upstream payload when install resolves with 201 CREATED', async () => {
      const payload = {
        message: 'Plugin successfully installed!',
        success: true,
        data: { redirect_url: '/music' },
      };

      requestClient.send.mockResolvedValue({
        statusCode: HttpStatus.CREATED,
        headers: {},
        data: payload,
      });

      await expect(service.install(dto, authToken, pluginId)).resolves.toEqual(payload);
      expect(requestClient.send).toHaveBeenCalledWith({
        url: `https://api.zuri.chat/organizations/${dto.organisation_id}/plugins`,
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: {
          plugin_id: pluginId,
          user_id: dto.user_id,
          organisation_id: dto.organisation_id,
        },
      });
    });

    it('should accept 200 OK as a successful installation', async () => {
      const payload = {
        message: 'Plugin successfully installed!',
        success: true,
        data: { redirect_url: '/music' },
      };

      requestClient.send.mockResolvedValue({
        statusCode: HttpStatus.OK,
        headers: {},
        data: payload,
      });

      await expect(service.install(dto, authToken, pluginId)).resolves.toEqual(payload);
    });

    it('should throw HttpException when upstream returns non-success status', async () => {
      requestClient.send.mockResolvedValue({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        headers: {},
        data: undefined,
      });

      await expect(service.install(dto, authToken, pluginId)).rejects.toBeInstanceOf(HttpException);
      await expect(service.install(dto, authToken, pluginId)).rejects.toHaveProperty(
        'status',
        HttpStatus.FAILED_DEPENDENCY,
      );
    });

    it('should throw HttpException with fallback payload when request rejects', async () => {
      requestClient.send.mockRejectedValue(new Error('network error'));

      await expect(service.install(dto, authToken, pluginId)).rejects.toBeInstanceOf(HttpException);
      await expect(service.install(dto, authToken, pluginId)).rejects.toMatchObject({
        status: HttpStatus.FAILED_DEPENDENCY,
        response: {
          message: 'There is an Error with this installation! Please contact Admin',
          success: false,
          data: null,
        },
      });
    });
  });
});

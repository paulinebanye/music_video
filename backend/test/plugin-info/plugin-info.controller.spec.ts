import { Test, TestingModule } from '@nestjs/testing';
import { PluginInfoController } from '../../src/plugin-info/plugin-info.controller';
import { HttpException } from '@nestjs/common';
import { PluginInfoService } from '../../src/plugin-info/plugin-info.service';
import { PluginInfoResponseDto } from '../../src/plugin-info/dto/plugin-info-response.dto';
import {
  PluginInstallResponseDto,
  PluginInstallRequestDto,
} from '../../src/plugin-info/dto/plugin-install.dto';
import { PluginPingResponseDto } from '../../src/plugin-info/dto/plugin-ping-response.dto';
import {
  PluginUninstallRequestDto,
  PluginUninstallResponseDto,
} from '../../src/plugin-info/dto/plugin-uninstall.dto';

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
            ping: jest.fn(),
            install: jest.fn(),
            uninstall: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PluginInfoController>(PluginInfoController);
    service = module.get(PluginInfoService) as jest.Mocked<PluginInfoService>;
  });

  afterEach(() => {
    jest.resetAllMocks();
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

  describe('ping', () => {
    it('should return the payload provided by the service', async () => {
      const payload = {
        server: [
          {
            status: 'Success',
            Report: ['The music.zuri.chat server is working'],
          },
        ],
      };
      service.ping.mockResolvedValue(payload);

      await expect(controller.ping()).resolves.toBe(payload);
      expect(service.ping).toHaveBeenCalledTimes(1);
    });

    it('should rethrow HttpException from the service', async () => {
      const error = new HttpException('failed', 424);
      service.ping.mockRejectedValue(error);

      await expect(controller.ping()).rejects.toBe(error);
      expect(service.ping).toHaveBeenCalledTimes(1);
    });

    it('should rethrow generic errors from the service', async () => {
      const error = new Error('network failure');
      service.ping.mockRejectedValue(error);

      await expect(controller.ping()).rejects.toBe(error);
      expect(service.ping).toHaveBeenCalledTimes(1);
    });
  });

  describe('install', () => {
    it('should delegate to the service and return its payload', async () => {
      const authHeader = 'Bearer token';
      const dto: PluginInstallRequestDto = {
        user_id: 'user-1',
        organisation_id: 'org-1',
      };
      const payload: PluginInstallResponseDto = {
        message: 'Plugin successfully installed!',
        success: true,
        data: { redirect_url: '/music' },
      };
      const pluginId = 'plugin-123';
      const originalPluginId = process.env.PLUGIN_ID;
      process.env.PLUGIN_ID = pluginId;
      service.install.mockResolvedValue(payload);

      await expect(controller.install(dto, authHeader)).resolves.toBe(payload);
      expect(service.install).toHaveBeenCalledTimes(1);
      expect(service.install).toHaveBeenCalledWith(dto, authHeader, pluginId);

      process.env.PLUGIN_ID = originalPluginId;
    });

    it('should propagate errors from the service', async () => {
      const authHeader = 'Bearer token';
      const dto: PluginInstallRequestDto = {
        user_id: 'user-1',
        organisation_id: 'org-1',
      };
      const pluginId = 'plugin-123';
      const originalPluginId = process.env.PLUGIN_ID;
      process.env.PLUGIN_ID = pluginId;
      const error = new HttpException('failed', 424);
      service.install.mockRejectedValue(error);

      await expect(controller.install(dto, authHeader)).rejects.toBe(error);
      expect(service.install).toHaveBeenCalledTimes(1);
      expect(service.install).toHaveBeenCalledWith(dto, authHeader, pluginId);

      process.env.PLUGIN_ID = originalPluginId;
    });
  });

  describe('uninstall', () => {
    it('should delegate to the service and return its payload', async () => {
      const authHeader = 'Bearer token';
      const dto: PluginUninstallRequestDto = {
        user_id: 'user-1',
        organisation_id: 'org-1',
      };
      const payload: PluginUninstallResponseDto = {
        message: 'Uninstalled successfully!',
        success: true,
        data: null,
      };
      const pluginId = 'plugin-123';
      const originalPluginId = process.env.PLUGIN_ID;
      process.env.PLUGIN_ID = pluginId;
      service.uninstall.mockResolvedValue(payload);

      await expect(controller.uninstall(dto, authHeader)).resolves.toBe(payload);
      expect(service.uninstall).toHaveBeenCalledTimes(1);
      expect(service.uninstall).toHaveBeenCalledWith(dto, authHeader, pluginId);

      process.env.PLUGIN_ID = originalPluginId;
    });

    it('should propagate errors from the service', async () => {
      const authHeader = 'Bearer token';
      const dto: PluginUninstallRequestDto = {
        user_id: 'user-1',
        organisation_id: 'org-1',
      };
      const payloadError = new HttpException('Failed', 424);
      const pluginId = 'plugin-123';
      const originalPluginId = process.env.PLUGIN_ID;
      process.env.PLUGIN_ID = pluginId;
      service.uninstall.mockRejectedValue(payloadError);

      await expect(controller.uninstall(dto, authHeader)).rejects.toBe(payloadError);
      expect(service.uninstall).toHaveBeenCalledTimes(1);
      expect(service.uninstall).toHaveBeenCalledWith(dto, authHeader, pluginId);

      process.env.PLUGIN_ID = originalPluginId;
    });
  });
});

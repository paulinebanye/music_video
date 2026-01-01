import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class PluginInfoDetailsDto {
  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  description!: string[];
}

class PluginInfoDataDto {
  @Expose()
  @IsString()
  type!: string;

  @Expose()
  @ValidateNested()
  @Type(() => PluginInfoDetailsDto)
  plugin_info!: PluginInfoDetailsDto;

  @Expose()
  @IsString()
  version!: string;

  @Expose()
  @IsOptional()
  @IsString()
  scaffold_structure?: string;

  @Expose()
  @IsOptional()
  @IsString()
  team?: string;

  @Expose()
  @IsOptional()
  @IsString()
  developer_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  developer_email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  icon_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  photos?: string;

  @Expose()
  @IsOptional()
  @IsString()
  homepage_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  sidebar_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  install_url?: string;

  @Expose()
  @IsOptional()
  @IsString()
  ping_url?: string;
}

export class PluginInfoResponseDto {
  @Expose()
  @IsString()
  message!: string;

  @Expose()
  @ValidateNested()
  @Type(() => PluginInfoDataDto)
  data!: PluginInfoDataDto;

  @Expose()
  @IsString()
  success!: string;
}

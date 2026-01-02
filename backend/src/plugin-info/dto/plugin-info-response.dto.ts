import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class PluginInfoDetailsDto {
  @ApiProperty()
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty({ type: [String] })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  description!: string[];
}

class PluginInfoDataDto {
  @ApiProperty()
  @Expose()
  @IsString()
  type!: string;

  @ApiProperty({ type: () => PluginInfoDetailsDto })
  @Expose()
  @ValidateNested()
  @Type(() => PluginInfoDetailsDto)
  plugin_info!: PluginInfoDetailsDto;

  @ApiProperty()
  @Expose()
  @IsString()
  version!: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  scaffold_structure?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  team?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  developer_name?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  developer_email?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  icon_url?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  photos?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  homepage_url?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  sidebar_url?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  install_url?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  ping_url?: string;
}

export class PluginInfoResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  message!: string;

  @ApiProperty({ type: () => PluginInfoDataDto })
  @Expose()
  @ValidateNested()
  @Type(() => PluginInfoDataDto)
  data!: PluginInfoDataDto;

  @ApiProperty()
  @Expose()
  @IsString()
  success!: string;
}

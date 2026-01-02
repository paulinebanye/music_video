import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PluginInstallRequestDto {
  @ApiProperty({ description: 'Identifier of the user performing the installation' })
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty({ description: 'Identifier of the organisation where the plugin will be installed' })
  @IsString()
  @IsNotEmpty()
  organisation_id!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PluginUninstallRequestDto {
  @ApiProperty({ description: 'Identifier of the user performing the uninstallation' })
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty({ description: 'Identifier of the organisation where the plugin will be removed' })
  @IsString()
  @IsNotEmpty()
  organisation_id!: string;
}

export class PluginUninstallResponseDto {
  @ApiProperty({ description: 'Response message describing uninstallation status' })
  @IsString()
  message!: string;

  @ApiProperty({ description: 'Indicates whether the uninstallation succeeded' })
  @IsBoolean()
  success!: boolean;

  @ApiProperty({
    description: 'Optional payload; legacy responses set this to null',
    required: false,
    nullable: true,
    type: Object,
  })
  @IsOptional()
  data?: null;
}

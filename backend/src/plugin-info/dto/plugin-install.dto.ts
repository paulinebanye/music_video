import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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

class PluginInstallResponseDataDto {
  @ApiProperty({ description: 'Redirect URL after successful installation' })
  @IsString()
  redirect_url!: string;
}

export class PluginInstallResponseDto {
  @ApiProperty({ description: 'Response message describing installation status' })
  @IsString()
  message!: string;

  @ApiProperty({ description: 'Indicates whether the installation succeeded' })
  @IsBoolean()
  success!: boolean;

  @ApiProperty({
    description: 'Optional payload providing additional context such as redirect paths',
    required: false,
    nullable: true,
    type: () => PluginInstallResponseDataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PluginInstallResponseDataDto)
  data?: PluginInstallResponseDataDto | null;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

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

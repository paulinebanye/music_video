import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class PluginPingServerReportDto {
  @ApiProperty({ description: 'Status of the upstream music server health check e.g. Success' })
  @IsString()
  status!: string;

  @ApiProperty({ type: [String], description: 'Detailed health report messages' })
  @IsArray()
  @IsString({ each: true })
  Report!: string[];
}

export class PluginPingResponseDto {
  @ApiProperty({
    type: [PluginPingServerReportDto],
    description: 'Collection of status reports for the plugin health check',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PluginPingServerReportDto)
  server!: PluginPingServerReportDto[];
}

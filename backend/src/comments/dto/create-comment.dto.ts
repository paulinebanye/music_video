import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class EmojiDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  emoji!: string;

  @IsInt()
  @Min(0)
  count!: number;
}

class DraftJsEntityRangeDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsInt()
  length?: number;

  @IsOptional()
  data?: Record<string, unknown>;
}

class DraftJsInlineStyleRangeDto {
  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsInt()
  length?: number;
}

class DraftJsBlockDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsInt()
  depth!: number;

  @IsOptional()
  data?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftJsEntityRangeDto)
  entityRanges?: DraftJsEntityRangeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftJsInlineStyleRangeDto)
  inlineStyleRanges?: DraftJsInlineStyleRangeDto[];
}

class UiDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftJsBlockDto)
  blocks!: DraftJsBlockDto[];

  @IsOptional()
  entityMap?: Record<string, unknown>;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsString()
  username?: string | null;

  @IsOptional()
  @IsString()
  userId?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsInt()
  time?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmojiDto)
  emojies?: EmojiDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UiDataDto)
  richUiData?: UiDataDto | null;
}

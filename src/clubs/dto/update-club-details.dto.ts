import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ClubFileType } from '../entities/club_file.entity';

export class ClubFileDto {
  @ApiProperty({
    enum: ClubFileType,
    description: 'Yüklenecek kulüp dosyasının türü',
  })
  @IsEnum(ClubFileType)
  type: ClubFileType;

  @ApiProperty({
    description: 'Dosya için özel bir ad (opsiyonel)',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileName?: string;
}

export class UpdateClubDetailsDto extends PartialType(CreateClubDto) {
  @ApiProperty({
    type: [ClubFileDto],
    description:
      'Kulübe eklenecek yeni dosyaların bilgileri (dosyaların kendisi ayrı yüklenir)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClubFileDto)
  @IsOptional()
  newClubFiles?: ClubFileDto[];

  @ApiProperty({
    description: 'Kulübün resmi olup olmadığını belirtir',
    required: false,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isOfficial?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ClubRank } from '../entities/club-member.entity';

export class AddMemberDto {
  @ApiProperty({ description: 'Kullanıcı ID' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Rütbe', enum: ClubRank, required: false })
  @IsEnum(ClubRank)
  @IsOptional()
  rank?: ClubRank;

  @ApiProperty({ description: 'Kulüp Şehir ID', required: false })
  @IsUUID()
  @IsOptional()
  clubCityId?: string;

  @ApiProperty({ description: 'Özel takma ad', required: false })
  @IsString()
  @IsOptional()
  customNickname?: string;
}

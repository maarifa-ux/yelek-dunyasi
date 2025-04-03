import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClubStatus } from '../entities/club.entity';

export class UpdateClubDto extends PartialType(CreateClubDto) {
  @ApiProperty({
    description: 'Kulüp durumu',
    enum: ClubStatus,
    required: false,
  })
  @IsEnum(ClubStatus)
  @IsOptional()
  status?: ClubStatus;

  @ApiProperty({ description: 'Aktif mi?', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ParticipationStatus } from '../entities/event-participant.entity';

export class UpdateParticipantDto {
  @ApiPropertyOptional({ enum: ParticipationStatus })
  @IsEnum(ParticipationStatus)
  @IsOptional()
  status?: ParticipationStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicleInfo?: string;
}

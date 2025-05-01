import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../entities/club-application.entity';

export class RespondApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsString()
  @IsOptional()
  responseNote?: string;
}

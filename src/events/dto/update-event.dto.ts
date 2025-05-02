import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}

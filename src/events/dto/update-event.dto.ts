import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({
    description: 'Etkinlik durumu',
    enum: EventStatus,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}

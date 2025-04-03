import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinEventDto {
  @ApiProperty({ description: 'Etkinlik ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}

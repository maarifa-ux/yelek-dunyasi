import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class CreateTeamInvitationDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  senderUserID: string;

  @ApiProperty({
    example: 'user@email.com',
  })
  @IsEmail()
  receiverUserMail: string;
}

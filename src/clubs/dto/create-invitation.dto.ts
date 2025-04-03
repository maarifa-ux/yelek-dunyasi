import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ description: 'Davet edilecek e-posta adresi' })
  @IsEmail()
  @IsNotEmpty()
  invitedEmail: string;

  @ApiPropertyOptional({ description: 'Davet edilecek kişinin adı' })
  @IsString()
  @IsOptional()
  invitedName?: string;

  @ApiPropertyOptional({ description: 'Davetiye mesajı' })
  @IsString()
  @IsOptional()
  message?: string;
}

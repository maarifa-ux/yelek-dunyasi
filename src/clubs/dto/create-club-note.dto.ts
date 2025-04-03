import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClubNoteDto {
  @ApiProperty({ description: 'Not başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Not içeriği' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Not kategorisi', required: false })
  @IsString()
  @IsOptional()
  category?: string;
}

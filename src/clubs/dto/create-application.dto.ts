import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  clubId: string;

  @IsString()
  @IsOptional()
  applicationNote?: string;
}

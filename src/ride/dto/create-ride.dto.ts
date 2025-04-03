import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RideType } from '../enums/ride-type.enum';

class RoutePointDto {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;
}

class RequirementsDto {
  @ApiProperty()
  @IsString()
  minExperience: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  requiredGear: string[];

  @ApiProperty()
  @IsString()
  difficulty: string;
}

export class CreateRideDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: RideType })
  @IsEnum(RideType)
  @IsNotEmpty()
  type: RideType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startLocation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endLocation: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ type: [RoutePointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  @IsOptional()
  route?: {
    points: RoutePointDto[];
    polyline: string;
  };

  @ApiProperty({ type: RequirementsDto })
  @ValidateNested()
  @Type(() => RequirementsDto)
  @IsOptional()
  requirements?: RequirementsDto;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  eventId?: string;
}

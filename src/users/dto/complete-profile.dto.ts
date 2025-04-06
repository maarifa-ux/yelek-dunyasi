import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DriverLicenseType } from '../entities/user.entity';
import { UpdateUserDto } from './update-user.dto';

export class CompleteProfileDto extends UpdateUserDto {
  @ApiProperty({ description: 'Kullanıcı adı' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ description: 'Telefon numarası' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Şehir' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'İlçe' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Sürücü belgesi tipi', enum: DriverLicenseType })
  @IsString()
  @IsOptional()
  driverLicenseType?: DriverLicenseType;

  @ApiProperty({ description: 'Motosiklet markası' })
  @IsString()
  @IsNotEmpty()
  motorcycleBrand: string;

  @ApiProperty({ description: 'Motosiklet modeli' })
  @IsString()
  @IsNotEmpty()
  motorcycleModel: string;

  @ApiProperty({ description: 'Motosiklet motor hacmi (cc)', required: false })
  @IsOptional()
  motorcycleCc?: number;

  @ApiProperty({ description: 'Acil durum kişisi adı', required: false })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiProperty({ description: 'Acil durum kişisi ilişkisi', required: false })
  @IsString()
  @IsOptional()
  emergencyContactRelation?: string;

  @ApiProperty({ description: 'Acil durum kişisi telefonu', required: false })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;
}

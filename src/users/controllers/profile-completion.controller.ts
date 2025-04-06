import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthUser } from '../../utils/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { CompleteProfileDto } from '../dto/complete-profile.dto';

@ApiTags('Profil Tamamlama')
@Controller('profile-completion')
export class ProfileCompletionController {
  constructor(private readonly usersService: UsersService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil tamamlama durumunu kontrol et' })
  async checkProfileStatus(@AuthUser() user: User) {
    return {
      isProfileCompleted: user.isProfileCompleted,
      userId: user.id,
      missingFields: this.getMissingFields(user),
    };
  }

  @Patch('complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil bilgilerini tamamla' })
  async completeProfile(
    @AuthUser() user: User,
    @Body() completeProfileDto: CompleteProfileDto,
  ) {
    const updatedUser = await this.usersService.update(
      user.id,
      completeProfileDto,
    );

    return {
      isProfileCompleted: updatedUser.isProfileCompleted,
      userId: updatedUser.id,
      missingFields: this.getMissingFields(updatedUser),
    };
  }

  private getMissingFields(user: User): string[] {
    const requiredFields = [
      'firstName',
      'lastName',
      'nickname',
      'phoneNumber',
      'city',
      'district',
      'motorcycleBrand',
      'motorcycleModel',
    ];

    return requiredFields.filter((field) => !user[field]);
  }
}

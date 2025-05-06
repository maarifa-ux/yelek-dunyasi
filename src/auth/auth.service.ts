/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import crypto from 'crypto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/statuses/entities/status.entity';
import { Role } from 'src/roles/entities/role.entity';
import { AuthProvidersEnum } from './auth-providers.enum';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import {
  LoginResponseType,
  ClubMembershipDetail,
} from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { SessionService } from 'src/session/session.service';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { Session } from 'src/session/entities/session.entity';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { ClubsService } from 'src/clubs/clubs.service';
import { EventsService } from 'src/events/events.service';
import { ClubRoleSetting } from 'src/clubs/entities/club-role-setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Express } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private clubsService: ClubsService,
    private eventsService: EventsService,
    @InjectRepository(ClubRoleSetting)
    private clubRoleSettingsRepository: Repository<ClubRoleSetting>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne(
      {
        email: loginDto.email,
      },
      {
        relations: [
          'clubMemberships',
          'clubMemberships.club',
          'clubMemberships.clubCity',
          'clubMemberships.clubCity.city',
        ],
      },
    );

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    const isProfileCompleted = user.isProfileCompleted;

    // Kullanıcının kulüp üyeliklerini al
    const clubMemberships = user.clubMemberships || [];

    // Kulüp izinlerini al
    const roleSettings = await this.clubRoleSettingsRepository.find();

    // Kullanıcının üye olduğu kulüpler için detaylı bilgileri hazırla
    const clubDetails: ClubMembershipDetail[] = await Promise.all(
      clubMemberships.map(async (membership) => {
        // İlgili kulüp rolünün izinlerini bul
        const roleSetting = roleSettings.find(
          (setting) => setting.rank === membership.rank,
        );

        // Şu anki ay içindeki etkinlikleri al
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let events: Event[] = [];
        if (membership.clubCityId) {
          // Şehre özel etkinlikleri al
          events = await this.eventsService.findByClubCity(
            membership.clubCityId,
            startOfMonth,
            endOfMonth,
          );
        } else {
          // Genel kulüp etkinliklerini al
          events = await this.eventsService.findByClub(
            membership.clubId,
            startOfMonth,
            endOfMonth,
          );
        }

        return {
          clubId: membership.clubId,
          clubName: membership.club?.name,
          clubLogo: membership.club?.logo,
          clubCity: membership.clubCity?.city?.name,
          rank: membership.rank,
          rankDescription: membership.rank,
          permissions: roleSetting
            ? {
                canCreateEvent: roleSetting.canCreateEvent,
                canManageMembers: roleSetting.canManageMembers,
                canManageCity: roleSetting.canManageCity,
                canSendAnnouncement: roleSetting.canSendAnnouncement,
                canAddProduct: roleSetting.canAddProduct,
                canManageClub: roleSetting.canManageClub,
                canRemoveMember: roleSetting.canRemoveMember,
                canManageEvents: roleSetting.canManageEvents,
              }
            : undefined,
          status: membership.status,
          events,
        };
      }),
    );

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
      isProfileCompleted,
      clubMemberships: clubDetails,
    };
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    let user: NullableType<User> = null;
    const socialEmail = socialData.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.usersService.findOne(
        {
          email: socialEmail,
        },
        {
          relations: [
            'clubMemberships',
            'clubMemberships.club',
            'clubMemberships.clubCity',
            'clubMemberships.clubCity.city',
          ],
        },
      );
    }

    if (socialData.id) {
      user = await this.usersService.findOne(
        {
          socialId: socialData.id,
          provider: authProvider,
        },
        {
          relations: [
            'clubMemberships',
            'clubMemberships.club',
            'clubMemberships.clubCity',
            'clubMemberships.clubCity.city',
          ],
        },
      );
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.update(user.id, user);
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      const role = plainToClass(Role, {
        id: RoleEnum.user,
      });
      const status = plainToClass(Status, {
        id: StatusEnum.active,
      });

      user = await this.usersService.create({
        email: socialEmail ?? null,
        firstName: socialData.firstName ?? null,
        lastName: socialData.lastName ?? null,
        profileImageUrl: socialData.profileImageUrl ?? null,
        socialId: socialData.id,
        provider: authProvider,
        role,
        status,
      });

      user = await this.usersService.findOne(
        {
          id: user.id,
        },
        {
          relations: [
            'clubMemberships',
            'clubMemberships.club',
            'clubMemberships.clubCity',
            'clubMemberships.clubCity.city',
          ],
        },
      );
    }

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'userNotFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    const isProfileCompleted = user.isProfileCompleted;

    // Kullanıcının kulüp üyeliklerini al
    const clubMemberships = user.clubMemberships || [];

    // Kulüp izinlerini al
    const roleSettings = await this.clubRoleSettingsRepository.find();

    // Kullanıcının üye olduğu kulüpler için detaylı bilgileri hazırla
    const clubDetails: ClubMembershipDetail[] = await Promise.all(
      clubMemberships.map(async (membership) => {
        // İlgili kulüp rolünün izinlerini bul
        const roleSetting = roleSettings.find(
          (setting) => setting.rank === membership.rank,
        );

        // Şu anki ay içindeki etkinlikleri al
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let events: Event[] = [];
        if (membership.clubCityId) {
          // Şehre özel etkinlikleri al
          events = await this.eventsService.findByClubCity(
            membership.clubCityId,
            startOfMonth,
            endOfMonth,
          );
        } else {
          // Genel kulüp etkinliklerini al
          events = await this.eventsService.findByClub(
            membership.clubId,
            startOfMonth,
            endOfMonth,
          );
        }

        return {
          clubId: membership.clubId,
          clubName: membership.club?.name,
          clubLogo: membership.club?.logo,
          clubCity: membership.clubCity?.city?.name,
          rank: membership.rank,
          rankDescription: membership.rank,
          permissions: roleSetting
            ? {
                canCreateEvent: roleSetting.canCreateEvent,
                canManageMembers: roleSetting.canManageMembers,
                canManageCity: roleSetting.canManageCity,
                canSendAnnouncement: roleSetting.canSendAnnouncement,
                canAddProduct: roleSetting.canAddProduct,
                canManageClub: roleSetting.canManageClub,
                canRemoveMember: roleSetting.canRemoveMember,
                canManageEvents: roleSetting.canManageEvents,
              }
            : undefined,
          status: membership.status,
          events,
        };
      }),
    );

    return {
      refreshToken,
      token: jwtToken,
      tokenExpires,
      user,
      isProfileCompleted,
      clubMemberships: clubDetails,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      } as Role,
      status: {
        id: StatusEnum.inactive,
      } as Status,
      hash,
    });

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOne({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = plainToClass(Status, {
      id: StatusEnum.active,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    await this.forgotService.create({
      hash,
      user,
    });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({
      where: {
        hash,
      },
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = forgot.user;
    user.password = password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });
    await user.save();
    await this.forgotService.softDelete(forgot.id);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findOne(
      {
        id: userJwtPayload.id,
      },
      {
        relations: [
          'clubMemberships',
          'clubMemberships.club',
          'clubMemberships.clubCity',
          'clubMemberships.clubCity.city',
        ],
      },
    );
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
    uploadedPhotoFile?: Express.Multer.File,
  ): Promise<NullableType<User>> {
    const updatePayload: Partial<User> = {};

    for (const key in userDto) {
      if (Object.prototype.hasOwnProperty.call(userDto, key)) {
        const value = userDto[key];
        updatePayload[key] = value === null ? undefined : value;
      }
    }

    if (uploadedPhotoFile) {
      const appUrl = process.env.APP_URL;
      if (!appUrl) {
        console.warn(
          'APP_URL ortam değişkeni tanımlı değil. profilePicture göreceli yol olacak.',
        );
        updatePayload.profilePicture = `/uploads/profile-pictures/${uploadedPhotoFile.filename}`;
      } else {
        updatePayload.profilePicture = `${appUrl}/uploads/profile-pictures/${uploadedPhotoFile.filename}`;
      }
    } else if (
      userDto.hasOwnProperty('profilePicture') &&
      (userDto as any).profilePicture === null
    ) {
      (updatePayload as any).profilePicture = null;
    }

    if (userDto.phoneNumber !== undefined) {
      updatePayload.phone =
        userDto.phoneNumber === null ? undefined : userDto.phoneNumber;
    }

    (updatePayload as any).photo = null;

    try {
      await this.usersService.update(userJwtPayload.id, updatePayload as any);
    } catch (error) {
      console.error(
        'AuthService: usersService.update çağrılırken hata oluştu:',
        error,
      );
      const errorMessage = 'Kullanıcı güncellenirken bir sorun oluştu.';
      let errorDetails = 'No details';
      if (error.driverError) {
        console.error(
          'AuthService: Veritabanı Sürücü Hatası Detayları:',
          error.driverError,
        );
        errorDetails = error.driverError.detail || error.driverError.message;
      }
      throw new HttpException(
        {
          message: errorMessage,
          originalError: error.message,
          details: errorDetails,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.usersService.findOne(
      { id: userJwtPayload.id },
      {
        relations: [
          'clubMemberships',
          'clubMemberships.club',
          'clubMemberships.clubCity',
          'clubMemberships.clubCity.city',
        ],
      },
    );
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'> & { user: User }> {
    const session = await this.sessionService.findOne({
      where: {
        id: data.sessionId,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    // User ilişkilerini manuel olarak yükle
    const user = await this.usersService.findOne(
      { id: session.user.id },
      {
        relations: [
          'clubMemberships',
          'clubMemberships.club',
          'clubMemberships.clubCity',
          'clubMemberships.clubCity.city',
        ],
      },
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    const isProfileCompleted = user.isProfileCompleted;

    // Kullanıcının kulüp üyeliklerini al
    const clubMemberships = user.clubMemberships || [];

    // Kulüp izinlerini al
    const roleSettings = await this.clubRoleSettingsRepository.find();

    // Kullanıcının üye olduğu kulüpler için detaylı bilgileri hazırla
    const clubDetails: ClubMembershipDetail[] = await Promise.all(
      clubMemberships.map(async (membership) => {
        // İlgili kulüp rolünün izinlerini bul
        const roleSetting = roleSettings.find(
          (setting) => setting.rank === membership.rank,
        );

        // Şu anki ay içindeki etkinlikleri al
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let events: Event[] = [];
        if (membership.clubCityId) {
          // Şehre özel etkinlikleri al
          events = await this.eventsService.findByClubCity(
            membership.clubCityId,
            startOfMonth,
            endOfMonth,
          );
        } else {
          // Genel kulüp etkinliklerini al
          events = await this.eventsService.findByClub(
            membership.clubId,
            startOfMonth,
            endOfMonth,
          );
        }

        return {
          clubId: membership.clubId,
          clubName: membership.club?.name,
          clubLogo: membership.club?.logo,
          clubCity: membership.clubCity?.city?.name,
          rank: membership.rank,
          rankDescription: membership.rank,
          permissions: roleSetting
            ? {
                canCreateEvent: roleSetting.canCreateEvent,
                canManageMembers: roleSetting.canManageMembers,
                canManageCity: roleSetting.canManageCity,
                canSendAnnouncement: roleSetting.canSendAnnouncement,
                canAddProduct: roleSetting.canAddProduct,
                canManageClub: roleSetting.canManageClub,
                canRemoveMember: roleSetting.canRemoveMember,
                canManageEvents: roleSetting.canManageEvents,
              }
            : undefined,
          status: membership.status,
          events,
        };
      }),
    );

    return {
      token,
      refreshToken,
      tokenExpires,
      isProfileCompleted,
      user,
      clubMemberships: clubDetails,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    console.log(this.configService.getOrThrow('auth.secret', { infer: true }));
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          email: User['email'],
          fullName: User['firstName'] + User['lastName'],
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}

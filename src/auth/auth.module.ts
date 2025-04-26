import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { ForgotModule } from 'src/forgot/forgot.module';
import { MailModule } from 'src/mail/mail.module';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { SessionModule } from 'src/session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ClubsModule } from 'src/clubs/clubs.module';
import { EventsModule } from 'src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubRoleSetting } from 'src/clubs/entities/club-role-setting.entity';

@Module({
  imports: [
    UsersModule,
    ForgotModule,
    SessionModule,
    PassportModule,
    MailModule,
    ClubsModule,
    EventsModule,
    TypeOrmModule.forFeature([ClubRoleSetting]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gizli_anahtar',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

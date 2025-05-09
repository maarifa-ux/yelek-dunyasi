import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { Club } from './entities/club.entity';
import { ClubMember } from './entities/club-member.entity';
import { ClubCity } from './entities/club-city.entity';
import { Announcement } from './entities/announcement.entity';
import { ClubNote } from './entities/club-note.entity';
import { ClubInvitation } from './entities/club-invitation.entity';
import { ClubApplication } from './entities/club-application.entity';
import { ClubRoleSetting } from './entities/club-role-setting.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { ClubFile } from './entities/club_file.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      ClubMember,
      ClubCity,
      Announcement,
      ClubNote,
      ClubInvitation,
      ClubApplication,
      ClubRoleSetting,
      ClubFile,
      Event,
    ]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}

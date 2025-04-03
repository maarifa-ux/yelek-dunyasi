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
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      ClubMember,
      ClubCity,
      Announcement,
      ClubNote,
      ClubInvitation,
    ]),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventParticipant } from './entities/event-participant.entity';
import { EventCheckpoint } from './entities/event-checkpoint.entity';
import { Checkpoint } from './entities/checkpoint.entity';
import { ClubsModule } from '../clubs/clubs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventParticipant,
      EventCheckpoint,
      Checkpoint,
    ]),
    ClubsModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

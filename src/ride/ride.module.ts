import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { Ride, RideParticipant } from './entities/ride.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, RideParticipant, Event])],
  controllers: [RideController],
  providers: [RideService],
  exports: [RideService],
})
export class RideModule {}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride, RideParticipant, RideStatus } from './entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
import { User } from '../users/entities/user.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class RideService {
  constructor(
    @InjectRepository(Ride)
    private rideRepository: Repository<Ride>,
    @InjectRepository(RideParticipant)
    private participantRepository: Repository<RideParticipant>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createRide(createRideDto: CreateRideDto, user: User): Promise<Ride> {
    const ride = this.rideRepository.create({
      ...createRideDto,
      creator: user,
      creatorId: user.id,
    });

    if (createRideDto.eventId) {
      const event = await this.eventRepository.findOne({
        where: { id: createRideDto.eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      ride.event = event;
      ride.eventId = event.id;
    }

    return this.rideRepository.save(ride);
  }

  async getRides(user: User): Promise<Ride[]> {
    const userRides = await this.rideRepository.find({
      where: { creatorId: user.id },
      relations: ['creator', 'event', 'participants'],
    });

    const participantRides = await this.rideRepository
      .createQueryBuilder('ride')
      .innerJoin('ride.participants', 'participant')
      .where('participant.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('ride.creator', 'creator')
      .leftJoinAndSelect('ride.event', 'event')
      .leftJoinAndSelect('ride.participants', 'participants')
      .getMany();

    return [...userRides, ...participantRides];
  }

  async getRideById(id: string): Promise<Ride> {
    const ride = await this.rideRepository.findOne({
      where: { id },
      relations: ['creator', 'event', 'participants'],
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    return ride;
  }

  async joinRide(rideId: string, user: User): Promise<RideParticipant> {
    const ride = await this.getRideById(rideId);

    if (ride.maxParticipants) {
      const participantCount = await this.participantRepository.count({
        where: { rideId },
      });

      if (participantCount >= ride.maxParticipants) {
        throw new BadRequestException('Ride is full');
      }
    }

    const existingParticipant = await this.participantRepository.findOne({
      where: {
        rideId,
        userId: user.id,
      },
    });

    if (existingParticipant) {
      throw new BadRequestException('Already joined this ride');
    }

    const participant = this.participantRepository.create({
      ride,
      rideId,
      user,
      userId: user.id,
    });

    return this.participantRepository.save(participant);
  }

  async leaveRide(rideId: string, user: User): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: {
        rideId,
        userId: user.id,
      },
    });

    if (!participant) {
      throw new NotFoundException('Not a participant of this ride');
    }

    await this.participantRepository.remove(participant);
  }

  async updateRideStatus(rideId: string, status: RideStatus): Promise<Ride> {
    const ride = await this.getRideById(rideId);
    ride.status = status;

    if (status === RideStatus.COMPLETED) {
      ride.endTime = new Date();
    }

    return this.rideRepository.save(ride);
  }
}

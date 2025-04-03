import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { RideType } from '../enums/ride-type.enum';

export enum RideStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: RideType,
    default: RideType.ROAD,
  })
  type: RideType;

  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.PLANNED,
  })
  status: RideStatus;

  @Column()
  startLocation: string;

  @Column()
  endLocation: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp', { nullable: true })
  endTime: Date;

  @Column('float', { nullable: true })
  distance: number;

  @Column('int', { nullable: true })
  duration: number;

  @Column('int', { nullable: true })
  maxParticipants: number;

  @Column('jsonb', { nullable: true })
  route: {
    points: Array<{ lat: number; lng: number }>;
    polyline: string;
  };

  @Column('jsonb', { nullable: true })
  weather: {
    temperature: number;
    conditions: string;
    windSpeed: number;
  };

  @Column('jsonb', { nullable: true })
  requirements: {
    minExperience: string;
    requiredGear: string[];
    difficulty: string;
  };

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column('uuid')
  creatorId: string;

  @ManyToOne(() => Event, { eager: true, nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column('uuid', { nullable: true })
  eventId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('ride_participants')
export class RideParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ride, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ride_id' })
  ride: Ride;

  @Column('uuid')
  rideId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @Column('boolean', { default: false })
  isConfirmed: boolean;
}

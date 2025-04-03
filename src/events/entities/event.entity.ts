import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { User } from '../../users/entities/user.entity';
import { EventParticipant } from './event-participant.entity';
import { EventCheckpoint } from './event-checkpoint.entity';
import { ClubCity } from '../../clubs/entities/club-city.entity';

export enum EventType {
  RIDE = 'ride',
  MEETING = 'meeting',
  FESTIVAL = 'festival',
  TRAINING = 'training',
  OTHER = 'other',
}

export enum EventScope {
  CLUB = 'club',
  CITY = 'city',
  PUBLIC = 'public',
}

export enum EventStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column({ nullable: false })
  clubId: string;

  @ManyToOne(() => ClubCity, { nullable: true })
  @JoinColumn()
  clubCity: ClubCity;

  @Column({ nullable: true })
  clubCityId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ nullable: false })
  creatorId: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.RIDE,
  })
  type: EventType;

  @Column({
    type: 'enum',
    enum: EventScope,
    default: EventScope.CLUB,
  })
  scope: EventScope;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PLANNED,
  })
  status: EventStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column()
  startLocation: string;

  @Column()
  startLocationLatitude: number;

  @Column()
  startLocationLongitude: number;

  @Column({ nullable: true })
  endLocation: string;

  @Column({ nullable: true })
  endLocationLatitude: number;

  @Column({ nullable: true })
  endLocationLongitude: number;

  @Column({ nullable: true })
  totalDistance: number;

  @Column({ default: false })
  isManualDistanceCalculation: boolean;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: 0 })
  participantCount: number;

  @Column({ default: 0 })
  confirmedParticipantCount: number;

  @Column('simple-array', { nullable: true })
  targetRanks: string[];

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];

  @OneToMany(() => EventCheckpoint, (checkpoint) => checkpoint.event)
  checkpoints: EventCheckpoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

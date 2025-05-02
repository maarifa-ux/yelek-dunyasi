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
  TRAINING = 'training',
  RACE = 'race',
  SOCIAL = 'social',
  OTHER = 'other',
  RIDE = 'ride',
  MEETING = 'meeting',
  FESTIVAL = 'festival',
}

export enum EventScope {
  CLUB = 'club',
  PUBLIC = 'public',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TargetRank {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
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
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'location_name' })
  locationName: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ name: 'destination_location_name' })
  destinationLocationName: string;

  @Column('decimal', { precision: 10, scale: 8, name: 'destination_latitude' })
  destinationLatitude: number;

  @Column('decimal', { precision: 11, scale: 8, name: 'destination_longitude' })
  destinationLongitude: number;

  @Column('jsonb', { nullable: true })
  waypoints: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
  }[];

  @Column({ nullable: true, name: 'max_participants' })
  maxParticipants: number;

  @Column({ default: false, name: 'is_private' })
  isPrivate: boolean;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @ManyToOne(() => Club, (club) => club.events)
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => ClubCity, { nullable: true })
  @JoinColumn({ name: 'clubCityId' })
  clubCity: ClubCity;

  @Column({ nullable: true })
  clubCityId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  distance: number;

  @Column({ nullable: true, name: 'travel_link' })
  travelLink: string;

  @Column('text', { array: true, nullable: true })
  targetRanks: TargetRank[];

  @Column({ default: 0 })
  participantCount: number;

  @Column({ default: 0 })
  confirmedParticipantCount: number;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];

  @OneToMany(() => EventCheckpoint, (checkpoint) => checkpoint.event)
  checkpoints: EventCheckpoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

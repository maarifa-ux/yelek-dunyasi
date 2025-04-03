import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Club } from './club.entity';
import { ClubCity } from './club-city.entity';

export enum ClubRank {
  GENERAL_PRESIDENT = 'general_president',
  GENERAL_COACH = 'general_coach',
  GENERAL_ROAD_CAPTAIN = 'general_road_captain',
  GENERAL_COORDINATOR = 'general_coordinator',
  GENERAL_DISCIPLINE = 'general_discipline',
  GENERAL_TREASURER = 'general_treasurer',
  CITY_PRESIDENT = 'city_president',
  CITY_COACH = 'city_coach',
  CITY_ROAD_CAPTAIN = 'city_road_captain',
  CITY_COORDINATOR = 'city_coordinator',
  CITY_DISCIPLINE = 'city_discipline',
  CITY_TREASURER = 'city_treasurer',
  MEMBER = 'member',
  PROSPECT = 'prospect',
  HANGAROUND = 'hangaround',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

@Entity()
export class ClubMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.clubMemberships)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Club, (club) => club.members)
  @JoinColumn()
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => ClubCity, (clubCity) => clubCity.members, { nullable: true })
  @JoinColumn()
  clubCity: ClubCity;

  @Column({ nullable: true })
  clubCityId: string;

  @Column({
    type: 'enum',
    enum: ClubRank,
    default: ClubRank.HANGAROUND,
  })
  rank: ClubRank;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.PENDING,
  })
  status: MemberStatus;

  @Column({ default: 0 })
  totalKilometers: number;

  @Column({ nullable: true })
  customNickname: string;

  @Column({ default: false })
  canCreateEvent: boolean;

  @Column({ default: false })
  canManageMembers: boolean;

  @Column({ default: false })
  canManageCity: boolean;

  @Column({ default: false })
  canSendAnnouncement: boolean;

  @Column({ default: false })
  canAddProduct: boolean;

  @Column({ default: false })
  canManageClub: boolean;

  @Column({ default: false })
  canRemoveMember: boolean;

  @Column({ type: 'date', nullable: true })
  hangaroundStartDate: Date;

  @Column({ type: 'date', nullable: true })
  prospectStartDate: Date;

  @Column({ type: 'date', nullable: true })
  memberStartDate: Date;

  @Column({ default: false })
  canManageEvents: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

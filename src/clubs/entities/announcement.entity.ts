import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Club } from './club.entity';
import { User } from '../../users/entities/user.entity';
import { ClubCity } from './club-city.entity';

export enum AnnouncementScope {
  ALL_CLUB = 'all_club',
  CITY = 'city',
  SPECIFIC_RANKS = 'specific_ranks',
}

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Club, (club) => club.announcements)
  @JoinColumn()
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => ClubCity, { nullable: true })
  @JoinColumn()
  targetCity: ClubCity;

  @Column({ nullable: true })
  targetCityId: string;

  @Column({
    type: 'enum',
    enum: AnnouncementScope,
    default: AnnouncementScope.ALL_CLUB,
  })
  scope: AnnouncementScope;

  @Column('simple-array', { nullable: true })
  targetRanks: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

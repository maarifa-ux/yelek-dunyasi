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

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity()
export class ClubInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Club)
  @JoinColumn()
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  invitedBy: User;

  @Column()
  invitedById: string;

  @Column({ nullable: true })
  invitedEmail: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  invitedUser: User;

  @Column({ nullable: true })
  invitedUserId: string;

  @ManyToOne(() => ClubCity, { nullable: true })
  @JoinColumn()
  targetCity: ClubCity;

  @Column({ nullable: true })
  targetCityId: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Column({ unique: true })
  invitationToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

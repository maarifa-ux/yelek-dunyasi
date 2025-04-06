import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClubRank } from './club-member.entity';

@Entity()
export class ClubRoleSetting {
  @PrimaryColumn({
    type: 'enum',
    enum: ClubRank,
  })
  rank: ClubRank;

  @Column()
  description: string;

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

  @Column({ default: false })
  canManageEvents: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

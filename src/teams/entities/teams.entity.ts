/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Invitation } from './invitation.entity';
import { TeamMember } from './teams_to_members.entity';

@Entity({
  name: 'teams',
})
export class Team {
  @Column({
    primary: true,
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @OneToMany(() => TeamMember, (teamToMember) => teamToMember.team)
  teamToMembers: TeamMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.team)
  invitations: Invitation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

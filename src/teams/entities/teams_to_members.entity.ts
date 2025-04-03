import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Invitation } from './invitation.entity';
import { Team } from './teams.entity';

export enum TeamMemberRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

@Entity({ name: 'team_members' })
export class TeamMember {
  @OneToOne(() => Invitation)
  @JoinColumn({ name: 'invitation_id' })
  invitation: Invitation;

  @PrimaryColumn({ name: 'invitation_id', type: 'uuid', nullable: false })
  invitationID: string;

  @ManyToOne(() => Team, (team) => team.teamToMembers)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'team_id', type: 'uuid', nullable: false })
  teamID: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userID: string;

  @Column({
    type: 'enum',
    enum: TeamMemberRole,
    default: TeamMemberRole.MEMBER,
  })
  role: TeamMemberRole;

  @Column({
    name: 'joined_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt: Date;
}

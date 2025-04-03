import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Team } from './teams.entity';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({
  name: 'invitations',
})
export class Invitation {
  @Column({
    primary: true,
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id: string;

  @ManyToOne(() => Team, (team) => team.invitations)
  @JoinColumn({ name: 'teams_id' })
  team: Team;

  @Column({ type: 'uuid', name: 'teams_id', nullable: false })
  teamID: string;

  @ManyToOne(() => User, (user) => user.sentInvitations)
  @JoinColumn({ name: 'sender_user_id' })
  senderUser: User;

  @Column({ type: 'uuid', name: 'sender_user_id', nullable: false })
  senderUserID: string;

  @ManyToOne(() => User, (user) => user.receivedInvitations)
  @JoinColumn({ name: 'receiver_user_id' })
  receiverUser: User;

  @Column({ type: 'uuid', name: 'receiver_user_id', nullable: false })
  receiverUserID: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

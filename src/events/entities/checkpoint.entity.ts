import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { EventCheckpoint, CheckpointType } from './event-checkpoint.entity';

@Entity('checkpoints')
export class Checkpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ default: 0 })
  orderIndex: number;

  @ManyToOne(() => Event, (event) => event.checkpoints)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @Column({
    type: 'enum',
    enum: CheckpointType,
    default: CheckpointType.WAYPOINT,
  })
  type: CheckpointType;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum CheckpointType {
  START = 'start',
  WAYPOINT = 'waypoint',
  END = 'end',
}

@Entity('event_checkpoints')
export class EventCheckpoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.checkpoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  name: string;

  @Column({ enum: CheckpointType, default: CheckpointType.WAYPOINT })
  type: CheckpointType;

  @Column({ default: 0 })
  orderIndex: number;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  estimatedArrivalTime: string;

  @Column({ nullable: true })
  estimatedDepartureTime: string;

  @Column({ type: 'float', nullable: true })
  distanceFromPrevious: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

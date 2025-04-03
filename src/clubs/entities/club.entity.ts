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
import { User } from '../../users/entities/user.entity';
import { ClubMember } from './club-member.entity';
import { Event } from '../../events/entities/event.entity';
import { Product } from '../../marketplace/entities/product.entity';
import { Announcement } from './announcement.entity';
import { ClubCity } from './club-city.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { ClubNote } from './club-note.entity';

export enum ClubType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ClubStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: ClubType,
    default: ClubType.PRIVATE,
  })
  type: ClubType;

  @Column({
    type: 'enum',
    enum: ClubStatus,
    default: ClubStatus.ACTIVE,
  })
  status: ClubStatus;

  @Column({ default: false })
  isOfficial: boolean;

  @Column({ default: 0 })
  memberCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFreeForever: boolean;

  @ManyToOne(() => User, (user) => user.foundedClubs)
  @JoinColumn()
  founder: User;

  @Column()
  founderId: string;

  @OneToMany(() => ClubMember, (member) => member.club)
  members: ClubMember[];

  @OneToMany(() => Event, (event) => event.club)
  events: Event[];

  @OneToMany(() => Product, (product) => product.club)
  products: Product[];

  @OneToMany(() => Announcement, (announcement) => announcement.club)
  announcements: Announcement[];

  @OneToMany(() => ClubCity, (clubCity) => clubCity.club)
  cities: ClubCity[];

  @OneToMany(() => ClubNote, (note) => note.club)
  notes: ClubNote[];

  @OneToMany(() => Subscription, (subscription) => subscription.club)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

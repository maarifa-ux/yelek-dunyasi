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
import { Club } from './club.entity';
import { ClubMember } from './club-member.entity';
import { City } from '../../cities/entities/city.entity';

@Entity()
export class ClubCity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Club, (club) => club.cities)
  @JoinColumn()
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => City)
  @JoinColumn()
  city: City;

  @Column()
  cityId: string;

  @OneToMany(() => ClubMember, (member) => member.clubCity)
  members: ClubMember[];

  @Column({ default: 0 })
  memberCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

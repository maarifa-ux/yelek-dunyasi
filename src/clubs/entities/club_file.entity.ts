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

export enum ClubFileType {
  CLUB_REGULATIONS = 'club_regulations', // Kulüp Tüzüğü
  CLUB_ROAD_GUIDELINE = 'club_road_guideline', // Kulüp Sürüş Rehberi
  CLUB_STANDART_FILE = 'club_standart_file', // Kulüp Standart Dosya
  CLUB_EVENT_FILE = 'club_event_file', // Kulüp Etkinlik Dosyası
}

@Entity('club_files')
export class ClubFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Club, (club) => club.clubFiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @Column()
  clubId: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({
    type: 'enum',
    enum: ClubFileType,
  })
  fileType: ClubFileType;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy?: User;

  @Column({ nullable: true })
  uploadedById?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

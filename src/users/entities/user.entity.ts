/* eslint-disable prettier/prettier */
import bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { Invitation } from 'src/teams/entities/invitation.entity';
import { TeamMember } from 'src/teams/entities/teams_to_members.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { ClubMember } from '../../clubs/entities/club-member.entity';
import { EventParticipant } from '../../events/entities/event-participant.entity';
import { Order } from '../../marketplace/entities/order.entity';
import { Club } from '../../clubs/entities/club.entity';
import { Product } from '../../marketplace/entities/product.entity';
import { Event } from '../../events/entities/event.entity';

export enum DriverLicenseType {
  A = 'A',
  A1 = 'A1',
  A2 = 'A2',
  B = 'B',
  B1 = 'B1',
  OTHER = 'OTHER',
}

export enum BloodType {
  AP = 'A+',
  AN = 'A-',
  BP = 'B+',
  BN = 'B-',
  ABP = 'AB+',
  ABN = 'AB-',
  OP = 'O+',
  ON = 'O-',
  UNKNOWN = 'UNKNOWN',
}

export enum ClothingSize {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
}

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  phoneNumber: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({
    type: 'enum',
    enum: DriverLicenseType,
    default: DriverLicenseType.A,
  })
  driverLicenseType: DriverLicenseType;

  @Column({
    type: 'enum',
    enum: ClothingSize,
    default: ClothingSize.L,
  })
  clothingSize: ClothingSize;

  @Column({
    type: 'enum',
    enum: BloodType,
    default: BloodType.UNKNOWN,
  })
  bloodType: BloodType;

  @Column({ nullable: true })
  motorcycleBrand: string;

  @Column({ nullable: true })
  motorcycleModel: string;

  @Column({ nullable: true })
  motorcycleCc: number;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  hasProfilePicture: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactRelation: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  oneSignalPlayerId: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ClubMember, (clubMember) => clubMember.user)
  clubMemberships: ClubMember[];

  @OneToMany(() => EventParticipant, (participant) => participant.user)
  eventParticipations: EventParticipant[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Club, (club) => club.founder)
  foundedClubs: Club[];

  @OneToMany(() => Product, (product) => product.createdBy)
  createdProducts: Product[];

  @OneToMany(() => Event, (event) => event.creator)
  createdEvents: Event[];

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null;

  @Column({ type: String, nullable: true })
  gender: string | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  birthDate: Date | null;

  @Column({ type: String, nullable: true })
  profession: string | null;

  @Column({ type: String, nullable: true })
  profileImageUrl: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @OneToMany(() => TeamMember, (teamToMember) => teamToMember.user)
  teams: TeamMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.senderUser)
  sentInvitations: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.receiverUser)
  receivedInvitations: Invitation[];

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @DeleteDateColumn()
  deletedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

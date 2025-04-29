/* eslint-disable prettier/prettier */
import bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { Invitation } from '../../teams/entities/invitation.entity';
import { TeamMember } from '../../teams/entities/teams_to_members.entity';
import { EntityHelper } from '../../utils/entity-helper';
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

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true, default: '' })
  firstName: string;

  @Column({ nullable: true, default: '' })
  lastName: string;

  @Column({ unique: true, nullable: true })
  nickname: string;

  @Column({ nullable: true, default: '' })
  phoneNumber: string;

  @Column({ nullable: true, default: '' })
  city: string;

  @Column({ nullable: true, default: '' })
  district: string;

  @Column({
    type: 'enum',
    enum: DriverLicenseType,
    default: DriverLicenseType.A,
    nullable: true,
  })
  driverLicenseType: DriverLicenseType;

  @Column({
    type: 'enum',
    enum: ClothingSize,
    default: ClothingSize.L,
    nullable: true,
  })
  clothingSize: ClothingSize;

  @Column({
    type: 'enum',
    enum: BloodType,
    default: BloodType.UNKNOWN,
    nullable: true,
  })
  bloodType: BloodType;

  @Column({ nullable: true, default: '' })
  motorcycleBrand: string;

  @Column({ nullable: true, default: '' })
  motorcycleModel: string;

  @Column({ nullable: true, default: 0 })
  motorcycleCc: number;

  @Column({ nullable: true, default: '' })
  profilePicture: string;

  @Column({ default: false, nullable: true })
  isEmailVerified: boolean;

  @Column({ default: false, nullable: true })
  isPhoneVerified: boolean;

  @Column({ default: false, nullable: true })
  hasProfilePicture: boolean;

  @Column({ default: true, nullable: true })
  isActive: boolean;

  @Column({ nullable: true, default: '' })
  emergencyContactName: string;

  @Column({ nullable: true, default: '' })
  emergencyContactRelation: string;

  @Column({ nullable: true, default: '' })
  emergencyContactPhone: string;

  @Column({ nullable: true, default: '' })
  oneSignalPlayerId: string;

  @Column({ nullable: true, default: '' })
  phone: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
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

  @Column({ default: AuthProvidersEnum.email, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true, default: null })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null;

  @Column({ type: String, nullable: true, default: null })
  gender: string | null;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
    default: null,
  })
  birthDate: Date | null;

  @Column({ type: String, nullable: true, default: null })
  profession: string | null;

  @Column({ type: String, nullable: true, default: null })
  profileImageUrl: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => Role, {
    eager: true,
    nullable: true,
  })
  role?: Role | null;

  @ManyToOne(() => Status, {
    eager: true,
    nullable: true,
  })
  status?: Status;

  @OneToMany(() => TeamMember, (teamToMember) => teamToMember.user)
  teams: TeamMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.senderUser)
  sentInvitations: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.receiverUser)
  receivedInvitations: Invitation[];

  @Column({ type: String, nullable: true, default: null })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }

  // Kullanıcının profilinin tamamlanıp tamamlanmadığını kontrol eder
  get isProfileCompleted(): boolean {
    // Profilin tamamlanmış sayılması için gerekli alanların kontrolü
    return Boolean(
      this.firstName &&
        this.lastName &&
        this.nickname &&
        this.phoneNumber &&
        this.city &&
        this.district &&
        this.motorcycleBrand &&
        this.motorcycleModel,
    );
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club, ClubStatus, ClubType } from './entities/club.entity';
import {
  ClubMember,
  ClubRank,
  MemberStatus,
} from './entities/club-member.entity';
import { Announcement } from './entities/announcement.entity';
import { ClubCity } from './entities/club-city.entity';
import { ClubNote } from './entities/club-note.entity';
import { ClubInvitation } from './entities/club-invitation.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateClubNoteDto } from './dto/create-club-note.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AddCityDto } from './dto/add-city.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import {
  ClubApplication,
  ApplicationStatus,
} from './entities/club-application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { RespondApplicationDto } from './dto/respond-application.dto';

export interface ClubEventWithClubName {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  clubName: string;
  startLocation: string;
  startLocationLatitude: number;
  startLocationLongitude: number;
  endLocation: string | null;
  endLocationLatitude: number | null;
  endLocationLongitude: number | null;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  type: string;
  creator: {
    id: string;
    fullName: string;
    email: string;
    avatar: string | null;
  };
  participants: {
    id: string;
    fullName: string;
    email: string;
    avatar: string | null;
    joinDate: Date;
    status: string;
  }[];
  city: {
    id: string;
    name: string;
  } | null;
  club: {
    id: string;
    name: string;
    logo: string;
    type: string;
    memberCount: number;
  };
}

export interface UserClubEventsResult {
  message: string;
  data: {
    participatedEvents: {
      past: ClubEventWithClubName[];
      upcoming: ClubEventWithClubName[];
    };
    nonParticipatedEvents: ClubEventWithClubName[];
  };
}

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(ClubMember)
    private readonly clubMemberRepository: Repository<ClubMember>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(ClubCity)
    private readonly clubCityRepository: Repository<ClubCity>,
    @InjectRepository(ClubNote)
    private readonly clubNoteRepository: Repository<ClubNote>,
    @InjectRepository(ClubInvitation)
    private readonly clubInvitationRepository: Repository<ClubInvitation>,
    @InjectRepository(ClubApplication)
    private readonly clubApplicationRepository: Repository<ClubApplication>,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createClubDto: CreateClubDto, user: User): Promise<Club> {
    const existingClub = await this.clubRepository.findOne({
      where: { name: createClubDto.name },
    });

    if (existingClub) {
      throw new BadRequestException('Bu isimde bir kulüp zaten mevcut');
    }

    const club = this.clubRepository.create({
      ...createClubDto,
      founder: user,
      founderId: user.id,
    });

    await this.clubRepository.save(club);

    // Kurucuyu otomatik olarak General President olarak ekle
    const clubMember = this.clubMemberRepository.create({
      club,
      clubId: club.id,
      user,
      userId: user.id,
      rank: ClubRank.GENERAL_PRESIDENT,
      status: MemberStatus.ACTIVE,
      canCreateEvent: true,
      canManageMembers: true,
      canManageClub: true,
      canSendAnnouncement: true,
      canAddProduct: true,
      canRemoveMember: true,
      memberStartDate: new Date(),
    });

    await this.clubMemberRepository.save(clubMember);

    // Üye sayısını güncelle
    club.memberCount = 1;
    await this.clubRepository.save(club);

    return club;
  }

  async findAll(search?: string, type?: string): Promise<Club[]> {
    const query = this.clubRepository
      .createQueryBuilder('club')
      .where('club.isActive = :isActive', { isActive: true });

    if (search) {
      query.andWhere('club.name LIKE :search', { search: `%${search}%` });
    }

    if (type && Object.values(ClubType).includes(type as ClubType)) {
      query.andWhere('club.type = :type', { type });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: [
        'founder',
        'founder.role',
        'founder.status',
        'members',
        'members.user',
        'members.clubCity',
        'announcements',
        'announcements.createdBy',
        'announcements.targetCity',
        'events',
        'cities',
        'applications',
        'applications.user',
      ],
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    return club;
  }

  async update(
    id: string,
    updateClubDto: UpdateClubDto,
    user: User,
  ): Promise<Club> {
    const club = await this.findOne(id);

    // Yetki kontrolü
    await this.checkClubManagementPermission(club.id, user.id);

    Object.assign(club, updateClubDto);
    return this.clubRepository.save(club);
  }

  async remove(id: string, user: User): Promise<void> {
    const club = await this.findOne(id);

    // Sadece kurucu kulübü silebilir
    if (club.founderId !== user.id) {
      throw new ForbiddenException('Bu işlem için yetkiniz bulunmamaktadır');
    }

    // Aktif olmayan olarak işaretle
    club.isActive = false;
    club.status = ClubStatus.INACTIVE;
    await this.clubRepository.save(club);
  }

  // Üye yönetimi
  async addMember(
    clubId: string,
    addMemberDto: AddMemberDto,
    user: User,
    skipPermissionCheck: boolean = false,
  ): Promise<ClubMember> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    // Yetki kontrolü (skipPermissionCheck true ise atla)
    if (!skipPermissionCheck) {
      await this.checkMemberManagementPermission(club.id, user.id);
    }

    const memberUser = await this.getUserById(addMemberDto.userId);

    // Kullanıcı zaten üye mi kontrol et
    const existingMember = await this.clubMemberRepository.findOne({
      where: {
        clubId: club.id,
        userId: memberUser.id,
      },
    });

    if (existingMember) {
      throw new BadRequestException('Bu kullanıcı zaten kulübün üyesidir');
    }

    const clubMember = this.clubMemberRepository.create({
      club,
      clubId: club.id,
      user: memberUser,
      userId: memberUser.id,
      rank: addMemberDto.rank || ClubRank.HANGAROUND,
      status: MemberStatus.ACTIVE,
      clubCity: addMemberDto.clubCityId
        ? { id: addMemberDto.clubCityId }
        : undefined,
      clubCityId: addMemberDto.clubCityId,
      hangaroundStartDate: new Date(),
      canCreateEvent: false,
      canManageMembers: false,
      canManageClub: false,
      canSendAnnouncement: false,
      canAddProduct: false,
      canRemoveMember: false,
    });

    await this.clubMemberRepository.save(clubMember);

    // Üye sayısını güncelle
    club.memberCount += 1;
    await this.clubRepository.save(club);

    return clubMember;
  }

  async getMembers(clubId: string): Promise<ClubMember[]> {
    await this.findOne(clubId);

    return this.clubMemberRepository.find({
      where: { clubId },
      relations: ['user', 'clubCity'],
      order: { rank: 'ASC' },
    });
  }

  async updateMember(
    clubId: string,
    memberId: string,
    updateMemberDto: UpdateMemberDto,
    user: User,
  ): Promise<ClubMember> {
    await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkMemberManagementPermission(clubId, user.id);

    const member = await this.clubMemberRepository.findOne({
      where: { id: memberId, clubId },
    });

    if (!member) {
      throw new NotFoundException('Üye bulunamadı');
    }

    // Rütbe değişikliği yapılıyorsa tarih bilgilerini güncelle
    if (updateMemberDto.rank && updateMemberDto.rank !== member.rank) {
      if (
        updateMemberDto.rank === ClubRank.PROSPECT &&
        !member.prospectStartDate
      ) {
        member.prospectStartDate = new Date();
      } else if (
        updateMemberDto.rank === ClubRank.MEMBER &&
        !member.memberStartDate
      ) {
        member.memberStartDate = new Date();
      }
    }

    Object.assign(member, updateMemberDto);
    return this.clubMemberRepository.save(member);
  }

  async removeMember(
    clubId: string,
    memberId: string,
    user: User,
  ): Promise<void> {
    await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkMemberManagementPermission(clubId, user.id);

    const member = await this.clubMemberRepository.findOne({
      where: { id: memberId, clubId },
    });

    if (!member) {
      throw new NotFoundException('Üye bulunamadı');
    }

    // Kulüp kurucusu ise silmeye izin verme
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    if (member.userId === club.founderId) {
      throw new BadRequestException('Kulüp kurucusu silinemez');
    }

    await this.clubMemberRepository.remove(member);

    // Üye sayısını güncelle
    club.memberCount -= 1;
    await this.clubRepository.save(club);
  }

  // Duyurular
  async createAnnouncement(
    clubId: string,
    createAnnouncementDto: CreateAnnouncementDto,
    user: User,
  ): Promise<Announcement> {
    const club = await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkAnnouncementPermission(club.id, user.id);

    const announcement = this.announcementRepository.create({
      ...createAnnouncementDto,
      club,
      clubId: club.id,
      createdBy: user,
      createdById: user.id,
    });

    await this.announcementRepository.save(announcement);

    // Bildirim gönder
    this.sendAnnouncementNotification(club, announcement);

    return announcement;
  }

  async getAnnouncements(
    clubId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    data: Announcement[];
    total: number;
    page: number;
    limit: number;
  }> {
    await this.findOne(clubId);

    const [announcements, total] =
      await this.announcementRepository.findAndCount({
        where: { clubId, isActive: true },
        relations: ['createdBy', 'targetCity'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      data: announcements,
      total,
      page,
      limit,
    };
  }

  // Notlar
  async createNote(
    clubId: string,
    createClubNoteDto: CreateClubNoteDto,
    user: User,
  ): Promise<ClubNote> {
    const club = await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkClubManagementPermission(club.id, user.id);

    const note = this.clubNoteRepository.create({
      ...createClubNoteDto,
      club,
      clubId: club.id,
      createdBy: user,
      createdById: user.id,
    });

    return this.clubNoteRepository.save(note);
  }

  async getNotes(clubId: string): Promise<ClubNote[]> {
    await this.findOne(clubId);

    return this.clubNoteRepository.find({
      where: { clubId },
      relations: ['createdBy'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  // Davetiyeler
  async createInvitation(
    clubId: string,
    createInvitationDto: CreateInvitationDto,
    user: User,
  ): Promise<ClubInvitation> {
    const club = await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkMemberManagementPermission(club.id, user.id);

    const invitation = this.clubInvitationRepository.create({
      ...createInvitationDto,
      club,
      clubId: club.id,
      invitedBy: user,
      invitedById: user.id,
      invitationToken: randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
    });

    await this.clubInvitationRepository.save(invitation);

    // Davetiye e-postası gönder
    if (invitation.invitedEmail) {
      this.sendInvitationEmail(club, invitation);
    }

    return invitation;
  }

  // Şehirler
  async addCity(
    clubId: string,
    addCityDto: AddCityDto,
    user: User,
  ): Promise<ClubCity> {
    const club = await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkClubManagementPermission(club.id, user.id);

    // Şehir zaten eklenmiş mi kontrol et
    const existingCity = await this.clubCityRepository.findOne({
      where: {
        clubId: club.id,
        cityId: addCityDto.cityId,
      },
    });

    if (existingCity) {
      throw new BadRequestException('Bu şehir zaten kulübe eklenmiş');
    }

    const clubCity = this.clubCityRepository.create({
      club,
      clubId: club.id,
      cityId: addCityDto.cityId,
      city: { id: addCityDto.cityId },
    });

    return this.clubCityRepository.save(clubCity);
  }

  async getCities(clubId: string): Promise<ClubCity[]> {
    await this.findOne(clubId);

    return this.clubCityRepository.find({
      where: { clubId },
      relations: ['city'],
    });
  }

  // Yardımcı metotlar
  private async getUserById(userId: string): Promise<User> {
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  // Yetki kontrol metotları
  private async checkClubManagementPermission(
    clubId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.clubMemberRepository.findOne({
      where: {
        clubId,
        userId,
        status: MemberStatus.ACTIVE,
      },
    });

    if (!member) {
      throw new ForbiddenException('Bu kulüpte aktif üye değilsiniz');
    }

    if (!member.canManageClub) {
      throw new ForbiddenException('Bu işlem için yetkiniz bulunmamaktadır');
    }
  }

  private async checkMemberManagementPermission(
    clubId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.clubMemberRepository.findOne({
      where: {
        clubId,
        userId,
        status: MemberStatus.ACTIVE,
      },
    });

    if (!member) {
      throw new ForbiddenException('Bu kulüpte aktif üye değilsiniz');
    }

    if (!member.canManageMembers) {
      throw new ForbiddenException(
        'Üye yönetimi için yetkiniz bulunmamaktadır',
      );
    }
  }

  private async checkAnnouncementPermission(
    clubId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.clubMemberRepository.findOne({
      where: {
        clubId,
        userId,
        status: MemberStatus.ACTIVE,
      },
    });

    if (!member) {
      throw new ForbiddenException('Bu kulüpte aktif üye değilsiniz');
    }

    if (!member.canSendAnnouncement) {
      throw new ForbiddenException(
        'Duyuru oluşturmak için yetkiniz bulunmamaktadır',
      );
    }
  }

  // Bildirim metotları
  private async sendAnnouncementNotification(
    club: Club,
    announcement: Announcement,
  ): Promise<void> {
    // Kulüp üyelerini bul
    const members = await this.clubMemberRepository.find({
      where: { clubId: club.id, status: MemberStatus.ACTIVE },
      relations: ['user'],
    });

    // Alıcıları oluştur
    const recipients = members.map((member) => ({
      userId: member.userId,
    }));

    if (recipients.length > 0) {
      // Bildirim gönder
      await this.notificationsService.sendToRecipients(
        recipients,
        `${club.name} - Yeni Duyuru`,
        announcement.content,
        NotificationType.PUSH,
        { announcementId: announcement.id, clubId: club.id },
      );
    }
  }

  private async sendInvitationEmail(
    club: Club,
    invitation: ClubInvitation,
  ): Promise<void> {
    if (!invitation.invitedEmail) return;

    // E-posta ile bildirim gönder
    await this.notificationsService.sendToRecipients(
      [{ email: invitation.invitedEmail }],
      `${club.name} Kulübü'ne Davet`,
      `${invitation.invitedBy.fullName} sizi ${club.name} kulübüne davet ediyor. 
       Daveti kabul etmek için aşağıdaki linke tıklayın: 
       ${process.env.FRONTEND_URL}/clubs/invitation/${invitation.invitationToken}`,
      NotificationType.EMAIL,
      { clubId: club.id, invitationId: invitation.id },
    );
  }

  async getMemberByUserAndClub(
    userId: string,
    clubId: string,
  ): Promise<ClubMember | null> {
    return this.clubMemberRepository.findOne({
      where: { userId, clubId },
      relations: ['club', 'user'],
    });
  }

  async getClubMembers(
    clubId: string,
    status: MemberStatus = MemberStatus.ACTIVE,
  ): Promise<ClubMember[]> {
    const club = await this.findOne(clubId);

    return this.clubMemberRepository.find({
      where: { clubId: club.id, status },
      relations: ['user', 'clubCity'],
      order: { createdAt: 'ASC' },
    });
  }

  async getUserClubEvents(userId: string): Promise<UserClubEventsResult> {
    const clubMemberships = await this.clubMemberRepository.find({
      where: {
        userId,
        status: MemberStatus.ACTIVE,
      },
      relations: [
        'club',
        'club.events',
        'club.events.participants',
        'club.events.participants.user',
        'club.events.creator',
        'club.events.clubCity',
        'club.events.clubCity.city',
      ],
    });

    if (!clubMemberships || clubMemberships.length === 0) {
      return {
        message: 'User is not a member of any club',
        data: {
          participatedEvents: {
            past: [],
            upcoming: [],
          },
          nonParticipatedEvents: [],
        },
      };
    }

    const now = new Date();
    const result: UserClubEventsResult = {
      message: 'User club events retrieved successfully',
      data: {
        participatedEvents: {
          past: [],
          upcoming: [],
        },
        nonParticipatedEvents: [],
      },
    };

    for (const membership of clubMemberships) {
      const club = membership.club;

      if (club.events) {
        for (const event of club.events) {
          const participants = event.participants || [];
          const isParticipant = participants.some((p) => p.user.id === userId);
          const eventDate = new Date(event.startDate);

          const eventWithClubName: ClubEventWithClubName = {
            id: event.id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            startLocation: event.startLocation,
            startLocationLatitude: event.startLocationLatitude,
            startLocationLongitude: event.startLocationLongitude,
            endLocation: event.endLocation,
            endLocationLatitude: event.endLocationLatitude,
            endLocationLongitude: event.endLocationLongitude,
            maxParticipants: event.capacity || 0,
            currentParticipants: event.participantCount,
            status: event.status,
            type: event.type,
            clubName: club.name,
            creator: {
              id: event.creator.id,
              fullName: event.creator.fullName,
              email: event.creator.email,
              avatar: event.creator.profileImageUrl,
            },
            participants: participants.map((p) => ({
              id: p.user.id,
              fullName: p.user.fullName,
              email: p.user.email,
              avatar: p.user.profileImageUrl,
              joinDate: p.createdAt,
              status: p.status,
            })),
            city: event.clubCity
              ? {
                  id: event.clubCity.id,
                  name: event.clubCity.city?.name,
                }
              : null,
            club: {
              id: club.id,
              name: club.name,
              logo: club.logo || '',
              type: club.type,
              memberCount: club.memberCount,
            },
          };

          if (isParticipant) {
            if (eventDate < now) {
              result.data.participatedEvents.past.push(eventWithClubName);
            } else {
              result.data.participatedEvents.upcoming.push(eventWithClubName);
            }
          } else {
            result.data.nonParticipatedEvents.push(eventWithClubName);
          }
        }
      }
    }

    // Sort by date
    result.data.participatedEvents.past.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    result.data.participatedEvents.upcoming.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
    result.data.nonParticipatedEvents.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    return result;
  }

  async applyToClub(
    createApplicationDto: CreateApplicationDto,
    user: User,
  ): Promise<{ message: string; application?: ClubApplication }> {
    console.log('Gelen DTO:', createApplicationDto);
    console.log('Gelen User:', user);

    if (!createApplicationDto?.clubId) {
      throw new BadRequestException("Kulüp ID'si gereklidir");
    }

    const club = await this.clubRepository.findOne({
      where: { id: createApplicationDto.clubId },
    });

    console.log('Bulunan Kulüp:', club);

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    if (!club.id) {
      throw new BadRequestException('Geçersiz kulüp verisi');
    }

    // Kullanıcı zaten üye mi kontrol et
    const existingMember = await this.clubMemberRepository.findOne({
      where: {
        clubId: club.id,
        userId: user.id,
      },
    });

    if (existingMember) {
      throw new BadRequestException('Zaten bu kulübün üyesisiniz');
    }

    // Eğer kulüp private değilse direkt üye olarak ekle
    if (club.type !== ClubType.PRIVATE) {
      await this.addMember(
        club.id,
        {
          userId: user.id,
          rank: ClubRank.HANGAROUND,
        },
        user,
        true, // skipPermissionCheck true olarak geçiyoruz
      );

      return {
        message: 'Kulübe başarıyla katıldınız',
      };
    }

    // Private kulüp için başvuru işlemleri
    const existingApplication = await this.clubApplicationRepository.findOne({
      where: {
        clubId: club.id,
        userId: user.id,
        status: ApplicationStatus.PENDING,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Zaten bekleyen bir başvurunuz bulunmakta');
    }

    const application = this.clubApplicationRepository.create({
      club,
      clubId: club.id,
      user,
      userId: user.id,
      applicationNote: createApplicationDto.applicationNote,
      status: ApplicationStatus.PENDING,
    });

    await this.clubApplicationRepository.save(application);

    return {
      message: 'Başvurunuz başarıyla alındı',
      application,
    };
  }

  async getClubApplications(
    clubId: string,
    user: User,
    status?: ApplicationStatus,
  ): Promise<ClubApplication[]> {
    console.log('getClubApplications - User:', user);
    console.log('getClubApplications - ClubId:', clubId);

    if (!user || !user.id) {
      throw new ForbiddenException('Kullanıcı bilgisi geçersiz');
    }

    const club = await this.clubRepository.findOne({
      where: { id: clubId },
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    // Yetki kontrolü
    await this.checkMemberManagementPermission(club.id, user.id);

    const query = this.clubApplicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .where('application.clubId = :clubId', { clubId });

    if (status) {
      query.andWhere('application.status = :status', { status });
    }

    return query.getMany();
  }

  async respondToApplication(
    applicationId: string,
    respondDto: RespondApplicationDto,
    user: User,
  ): Promise<ClubApplication> {
    console.log('respondToApplication - User:', user);
    console.log('respondToApplication - ApplicationId:', applicationId);
    console.log('respondToApplication - RespondDto:', respondDto);

    if (!user || !user.id) {
      throw new ForbiddenException('Kullanıcı bilgisi geçersiz');
    }

    const application = await this.clubApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['club', 'user'],
    });

    if (!application) {
      throw new NotFoundException('Başvuru bulunamadı');
    }

    if (!application.clubId) {
      throw new BadRequestException('Başvuru bilgileri geçersiz');
    }

    // Yetki kontrolü
    await this.checkMemberManagementPermission(application.clubId, user.id);

    // Başvuru zaten sonuçlandırılmış mı kontrol et
    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Bu başvuru zaten sonuçlandırılmış');
    }

    application.status = respondDto.status;
    application.responseNote = respondDto.responseNote || null;

    await this.clubApplicationRepository.save(application);

    // Eğer başvuru onaylandıysa, kullanıcıyı kulübe ekle
    if (respondDto.status === ApplicationStatus.APPROVED) {
      await this.addMember(
        application.clubId,
        {
          userId: application.userId,
          rank: ClubRank.HANGAROUND,
        },
        user,
        true, // skipPermissionCheck
      );

      // Bildirim gönder
      await this.notificationsService.sendToRecipients(
        [{ userId: application.userId }],
        `${application.club.name} - Başvuru Onaylandı`,
        'Kulüp başvurunuz onaylandı. Artık kulübün bir üyesisiniz!',
        NotificationType.PUSH,
        { clubId: application.clubId },
      );
    } else if (respondDto.status === ApplicationStatus.REJECTED) {
      // Red durumunda bildirim gönder
      await this.notificationsService.sendToRecipients(
        [{ userId: application.userId }],
        `${application.club.name} - Başvuru Reddedildi`,
        'Kulüp başvurunuz reddedildi.',
        NotificationType.PUSH,
        { clubId: application.clubId },
      );
    }

    return application;
  }

  async getUserApplications(
    userId: string,
    status?: ApplicationStatus,
  ): Promise<ClubApplication[]> {
    const query = this.clubApplicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.club', 'club')
      .where('application.userId = :userId', { userId });

    if (status) {
      query.andWhere('application.status = :status', { status });
    }

    return query.getMany();
  }
}

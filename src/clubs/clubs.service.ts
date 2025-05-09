import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
import {
  ClubApplicationsResponse,
  EnrichedClubApplication,
} from './interfaces/club-application.interface';
import { UpdateClubDetailsDto } from './dto/update-club-details.dto';
import { ClubFile } from './entities/club_file.entity';
import { Event } from '../events/entities/event.entity';

export interface ClubEventWithClubName {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  clubName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  destinationLocationName: string;
  destinationLatitude: number;
  destinationLongitude: number;
  waypoints?: {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
  }[];
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  type: string;
  isPrivate: boolean;
  tags?: string[];
  distance: number;
  travelLink?: string;
  targetRanks?: string[];
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
    @InjectRepository(ClubFile)
    private readonly clubFileRepository: Repository<ClubFile>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
    const club = await this.clubRepository.findOne({ where: { id } });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    // Kurucu (Founder) bilgisini çekme
    if (club.founderId) {
      try {
        // UsersService.findOne({ id: string }, relations?: string[]) şeklinde olduğunu varsayalım
        const founderUser = await this.usersService.findOne(
          { id: club.founderId } /*, ['role', 'status'] */,
        );
        club.founder = founderUser || null; // Club.founder: User | null olmalı
      } catch (error) {
        console.warn(`Error fetching founder for club ${id}:`, error);
        club.founder = null;
      }
    } else {
      club.founder = null;
    }

    // Üyeler (Members)
    club.members = await this.clubMemberRepository.find({
      where: { clubId: id },
      relations: ['user', 'clubCity'],
    });

    // Duyurular (Announcements)
    club.announcements = await this.announcementRepository.find({
      where: { clubId: id, isActive: true }, // isActive kontrolü örnek
      relations: ['createdBy', 'targetCity'],
      order: { createdAt: 'DESC' },
    });

    // Etkinlikler (Events)
    club.events = await this.eventRepository.find({
      where: { clubId: id }, // Event entity'sinde clubId veya club ilişkisi olmalı
    });

    // Şehirler (Cities)
    club.cities = await this.clubCityRepository.find({
      where: { clubId: id },
      relations: ['city'],
    });

    // Başvurular (Applications)
    club.applications = await this.clubApplicationRepository.find({
      where: { clubId: id },
      relations: ['user'],
    });

    // Kulüp Dosyaları (ClubFiles)
    club.clubFiles = await this.clubFileRepository.find({
      where: { clubId: id },
      relations: ['uploadedBy'],
    });

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
    this.sendAnnouncementNotification(
      club,
      announcement,
      createAnnouncementDto.priority || '',
    );

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
    priority: string,
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
        `${club.name} - Yeni Duyuru ${
          priority == 'NORMAL'
            ? 'ℹ️ Bilgilendirme'
            : priority == 'YUKSEK'
            ? '⚠️ Uyarı!'
            : '🚨 ACİL!'
        }`,
        announcement.content,
        NotificationType.PUSH,
        { announcementId: announcement.id, clubId: club.id },
        club.logo,
        club.logo,
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

          // City bilgisini al
          const city = event.clubCityId
            ? await this.clubCityRepository.findOne({
                where: { id: event.clubCityId },
                relations: ['city'],
              })
            : null;

          const eventWithClubName: ClubEventWithClubName = {
            id: event.id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            locationName: event.locationName,
            latitude: event.latitude,
            longitude: event.longitude,
            destinationLocationName: event.destinationLocationName,
            destinationLatitude: event.destinationLatitude,
            destinationLongitude: event.destinationLongitude,
            waypoints: event.waypoints,
            maxParticipants: event.maxParticipants || 0,
            currentParticipants: event.participantCount,
            status: event.status,
            type: event.type,
            isPrivate: event.isPrivate,
            tags: event.tags,
            distance: event.distance,
            travelLink: event.travelLink,
            targetRanks: event.targetRanks,
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
            city: city
              ? {
                  id: city.id,
                  name: city.city?.name || '',
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
    userAuth: User,
  ): Promise<{ message: string; application?: ClubApplication }> {
    console.log('Gelen DTO:', createApplicationDto);
    console.log('Gelen User:', userAuth);
    const user = await this.usersService.findOne({ id: userAuth.id });
    if (!user) {
      throw new NotFoundException('Başvuran kullanıcı bulunamadı.');
    }
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
        userId: user?.id,
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
          userId: user?.id || '',
          rank: ClubRank.HANGAROUND,
        },
        user || userAuth,
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
        userId: user?.id,
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
      userId: user?.id,
      applicationNote: createApplicationDto.applicationNote,
      status: ApplicationStatus.PENDING,
    });

    await this.clubApplicationRepository.save(application);

    // Şehir Başkanı ve Şehir Koçuna bildirim gönder
    try {
      const clubForNotification = await this.clubRepository.findOne({
        where: { id: createApplicationDto.clubId },
      });

      if (clubForNotification && user) {
        const targetRanks = [ClubRank.CITY_PRESIDENT, ClubRank.CITY_COACH];
        const membersToNotify = await this.clubMemberRepository.find({
          where: {
            clubId: createApplicationDto.clubId,
            rank: In(targetRanks), // In operatörü için typeorm importu gerekebilir
            status: MemberStatus.ACTIVE,
          },
          relations: ['user'], // User ilişkisini yükle
        });
        console.log(user);
        for (const member of membersToNotify) {
          if (member.user && member.user.oneSignalPlayerId) {
            const applicantName =
              user.fullName ||
              `${user.firstName} ${user.lastName}`.trim() ||
              'Bir kullanıcı';
            const clubName = clubForNotification.name;
            const rankTurkish =
              member.rank === ClubRank.CITY_PRESIDENT
                ? 'Şehir Başkanı'
                : 'Şehir Koçu';

            const notificationTitle = `${rankTurkish} olarak üyesi olduğunuz ${clubName}'e Başvuru Geldi`;
            const notificationMessage = `${applicantName} isimli bir kişiden başvuru geldi.`;

            await this.notificationsService.sendNotificationToUser(
              member.userId, // veya member.user.id
              notificationTitle,
              notificationMessage,
              NotificationType.PUSH,
              {
                applicationId: application.id,
                clubId: clubForNotification.id,
                applicantUserId: user.id,
              },
              club.logo,
              club.logo,
            );
          }
        }
      }
    } catch (notificationError) {
      console.error(
        'Kulüp başvurusu sonrası yetkililere bildirim gönderirken hata oluştu:',
        notificationError,
      );
      // Bildirim hatası ana işlemi etkilememeli
    }

    return {
      message: 'Başvurunuz başarıyla alındı',
      application,
    };
  }

  async getClubApplications(
    clubId: string,
    user: User,
    status?: ApplicationStatus,
  ): Promise<ClubApplicationsResponse> {
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

    // Ana başvuru sorgusunu oluştur
    const applicationsQuery = this.clubApplicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .where('application.clubId = :clubId', { clubId });

    if (status) {
      applicationsQuery.andWhere('application.status = :status', { status });
    }

    const applications = await applicationsQuery.getMany();

    // Her başvuru için kullanıcının diğer kulüp üyeliklerini ve başvurularını al
    const enrichedApplications = await Promise.all(
      applications.map(async (application) => {
        console.log('Checking memberships for userId:', application.userId);

        // Kullanıcının diğer kulüp üyeliklerini al
        const otherMembershipsQuery = this.clubMemberRepository
          .createQueryBuilder('member')
          .innerJoin('member.club', 'club')
          .where('member.userId = :userId', { userId: application.userId })
          .andWhere('member.clubId != :currentClubId', {
            currentClubId: clubId,
          })
          .select([
            'club.id as "clubId"',
            'club.name as "clubName"',
            'member.status as "memberStatus"',
            'member.rank as "memberRank"',
            'member.createdAt as "joinDate"',
          ]);

        console.log('Other memberships query:', otherMembershipsQuery.getSql());
        const otherMemberships = await otherMembershipsQuery.getRawMany();
        console.log('Other memberships result:', otherMemberships);

        // Kullanıcının diğer kulüp başvurularını al
        const otherApplicationsQuery = this.clubApplicationRepository
          .createQueryBuilder('app')
          .innerJoin('app.club', 'club')
          .where('app.userId = :userId', { userId: application.userId })
          .andWhere('app.clubId != :currentClubId', { currentClubId: clubId })
          .andWhere('app.status = :status', {
            status: ApplicationStatus.PENDING,
          })
          .select([
            'club.id as "clubId"',
            'club.name as "clubName"',
            'app.status as "status"',
            'app.createdAt as "applicationDate"',
          ]);

        console.log(
          'Other applications query:',
          otherApplicationsQuery.getSql(),
        );
        const otherApplications = await otherApplicationsQuery.getRawMany();
        console.log('Other applications result:', otherApplications);

        const enrichedApplication = {
          ...application,
          user: {
            ...application.user,
            otherClubMemberships: otherMemberships.map((m) => ({
              clubId: m.clubId,
              clubName: m.clubName,
              memberStatus: m.memberStatus,
              memberRank: m.memberRank,
              joinDate: m.joinDate,
            })),
            otherClubApplications: otherApplications.map((a) => ({
              clubId: a.clubId,
              clubName: a.clubName,
              status: a.status,
              applicationDate: a.applicationDate,
            })),
          },
        } as EnrichedClubApplication;

        console.log(
          'Enriched application:',
          JSON.stringify(enrichedApplication, null, 2),
        );

        return enrichedApplication;
      }),
    );

    return { applications: enrichedApplications };
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

      // Başvuru sahibine bildirim gönder
      if (application.user && application.user.oneSignalPlayerId) {
        const notificationTitle = `${application.club.name} - Başvuru Onaylandı`;
        const notificationMessage = `${application.club.name} adlı kulübe yaptığınız başvuru onaylandı. Artık kulübün bir üyesisiniz!`;
        await this.notificationsService.sendNotificationToUser(
          application.userId,
          notificationTitle,
          notificationMessage,
          NotificationType.PUSH,
          { clubId: application.clubId, applicationId: application.id },
          application.club.logo, // largeIcon
          application.club.logo, // bigPicture
        );
      }
    } else if (respondDto.status === ApplicationStatus.REJECTED) {
      // Başvuru sahibine red bildirim gönder
      if (application.user && application.user.oneSignalPlayerId) {
        const notificationTitle = `${application.club.name} - Başvuru Reddedildi`;
        const notificationMessage = `${application.club.name} adlı kulübe yaptığınız başvuru reddedildi.`;
        await this.notificationsService.sendNotificationToUser(
          application.userId,
          notificationTitle,
          notificationMessage,
          NotificationType.PUSH,
          { clubId: application.clubId, applicationId: application.id },
          application.club.logo, // largeIcon
          application.club.logo, // bigPicture
        );
      }
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

  async updateClubDetails(
    clubId: string,
    dto: UpdateClubDetailsDto,
    authUser: User,
    logoFile?: Express.Multer.File,
    coverFile?: Express.Multer.File,
    clubFileBlobs?: Express.Multer.File[],
  ): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    await this.checkClubManagementPermission(club.id, authUser.id);

    const { newClubFiles, ...clubUpdateData } = dto;
    Object.assign(club, clubUpdateData);

    if (logoFile) {
      club.logo = `/public/uploads/clubs_media/images/${logoFile.filename}`;
    }

    if (coverFile) {
      club.cover = `/public/uploads/clubs_media/images/${coverFile.filename}`;
    }
    club.isOfficial = dto.isOfficial || false;
    await this.clubRepository.save(club);

    if (
      clubFileBlobs &&
      newClubFiles &&
      newClubFiles.length > 0 &&
      clubFileBlobs.length === newClubFiles.length
    ) {
      for (let i = 0; i < clubFileBlobs.length; i++) {
        const fileBlob = clubFileBlobs[i];
        const fileData = newClubFiles[i];

        if (fileBlob && fileData) {
          const newClubFileEntity = this.clubFileRepository.create({
            clubId: club.id,
            fileUrl: `/public/uploads/clubs_media/documents/${fileBlob.filename}`,
            fileName: fileData.fileName || fileBlob.originalname,
            fileType: fileData.type,
            uploadedById: authUser.id,
          });
          await this.clubFileRepository.save(newClubFileEntity);
        }
      }
    } else if (
      clubFileBlobs &&
      newClubFiles &&
      clubFileBlobs.length !== newClubFiles.length
    ) {
      console.warn(
        'Yüklenen kulüp dosyalarının sayısı (clubFileBlobs) ile sağlanan dosya bilgisi (newClubFiles) sayısı eşleşmiyor. Dosyalar işlenmedi.',
      );
    }

    return this.findOne(clubId);
  }
}

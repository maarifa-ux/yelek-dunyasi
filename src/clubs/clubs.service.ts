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
      relations: ['founder'],
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
  ): Promise<ClubMember> {
    const club = await this.findOne(clubId);

    // Yetki kontrolü
    await this.checkMemberManagementPermission(club.id, user.id);

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
      status: MemberStatus.PENDING,
      clubCity: addMemberDto.clubCityId
        ? { id: addMemberDto.clubCityId }
        : undefined,
      clubCityId: addMemberDto.clubCityId,
      hangaroundStartDate: new Date(),
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
}

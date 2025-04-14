import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import {
  EventParticipant,
  ParticipationStatus,
} from './entities/event-participant.entity';
import {
  EventCheckpoint,
  CheckpointType,
} from './entities/event-checkpoint.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';

import { User } from '../users/entities/user.entity';
import { ClubsService } from '../clubs/clubs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { JoinEventDto } from './dto/join-event.dto';
import { Checkpoint } from './entities/checkpoint.entity';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventParticipant)
    private readonly participantRepository: Repository<EventParticipant>,
    @InjectRepository(EventCheckpoint)
    private readonly eventCheckpointRepository: Repository<EventCheckpoint>,
    @InjectRepository(Checkpoint)
    private readonly checkpointRepository: Repository<Checkpoint>,
    private readonly clubsService: ClubsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    // Kulübü kontrol et
    const club = await this.clubsService.findOne(createEventDto.clubId);

    // Kulübün etkinlik oluşturma izni olan üyesi mi kontrol et
    const member = await this.clubsService.getMemberByUserAndClub(
      user.id,
      club.id,
    );

    if (!member || !member.canCreateEvent) {
      throw new ForbiddenException(
        'Bu kulüpte etkinlik oluşturma yetkiniz bulunmamaktadır',
      );
    }

    // Etkinlik oluştur
    const event = this.eventRepository.create({
      ...createEventDto,
      creator: user,
      creatorId: user.id,
      club: club,
      clubId: club.id,
    });

    await this.eventRepository.save(event);

    // Etkinlik oluşturulduğunda katılımcı olarak ekle
    await this.participantRepository.save(
      this.participantRepository.create({
        event: event,
        user: user,
        userId: user.id,
        status: ParticipationStatus.CONFIRMED,
      }),
    );

    // Etkinliğe otomatik olarak START ve END kontrol noktaları ekle
    const startCheckpoint = this.eventCheckpointRepository.create({
      name: 'Başlangıç Noktası',
      type: CheckpointType.START,
      orderIndex: 0,
      address: createEventDto.locationName,
      latitude: createEventDto.latitude,
      longitude: createEventDto.longitude,
      event: event,
    });

    const endCheckpoint = this.eventCheckpointRepository.create({
      name: 'Bitiş Noktası',
      type: CheckpointType.END,
      orderIndex: 1,
      address: createEventDto.locationName,
      latitude: createEventDto.latitude,
      longitude: createEventDto.longitude,
      event: event,
    });

    await this.eventCheckpointRepository.save([startCheckpoint, endCheckpoint]);

    // Etkinliği bildirim olarak gönder
    this.sendEventNotification(event);

    return event;
  }

  async findAll(
    clubId?: string,
    status?: string,
    type?: string,
    fromDate?: string,
    search?: string,
  ): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.club', 'club')
      .leftJoinAndSelect('event.creator', 'creator')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.checkpoints', 'checkpoints')
      .orderBy('event.startDate', 'ASC');

    if (clubId) {
      query.andWhere('event.clubId = :clubId', { clubId });
    }

    if (status) {
      query.andWhere('event.status = :status', { status });
    }

    if (type) {
      query.andWhere('event.type = :type', { type });
    }

    if (fromDate) {
      query.andWhere('event.startDate >= :fromDate', { fromDate });
    }

    if (search) {
      query.andWhere(
        '(event.title LIKE :search OR event.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        'club',
        'creator',
        'participants',
        'participants.user',
        'checkpoints',
      ],
    });

    if (!event) {
      throw new NotFoundException('Etkinlik bulunamadı');
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    user: User,
  ): Promise<Event> {
    const event = await this.findOne(id);

    // Etkinliği güncelleyebilecek yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Bu etkinliği güncelleme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Etkinliği güncelle
    await this.eventRepository.update(id, updateEventDto);

    // Güncelleme sonrası bildirimleri gönder
    const updatedEvent = await this.findOne(id);
    if (updateEventDto.status && updateEventDto.status !== event.status) {
      this.sendEventStatusChangeNotification(updatedEvent);
    }

    return updatedEvent;
  }

  async remove(id: string, user: User): Promise<boolean> {
    const event = await this.findOne(id);

    // Etkinliği silebilecek yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Bu etkinliği silme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Etkinliği sil
    await this.eventRepository.remove(event);
    return true;
  }

  // Kontrol noktaları
  async addCheckpoint(
    eventId: string,
    createCheckpointDto: CreateCheckpointDto,
    user: User,
  ): Promise<EventCheckpoint> {
    const event = await this.findOne(eventId);

    // Kontrol noktası ekleyebilecek yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Bu etkinliğe kontrol noktası ekleme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Kontrol noktası ekle
    const checkpoint = this.eventCheckpointRepository.create({
      ...createCheckpointDto,
      event: event,
    });

    await this.eventCheckpointRepository.save(checkpoint);
    return checkpoint;
  }

  // Katılım metodları

  async joinEvent(
    eventId: string,
    joinEventDto: JoinEventDto,
    user: User,
  ): Promise<EventParticipant> {
    const event = await this.findOne(eventId);

    // Kullanıcı zaten kayıtlı mı kontrolü
    const existingParticipant = await this.participantRepository.findOne({
      where: { eventId, userId: user.id },
    });

    if (existingParticipant) {
      return existingParticipant;
    }

    const participant = this.participantRepository.create({
      event,
      user,
      userId: user.id,
      ...joinEventDto,
    });

    return this.participantRepository.save(participant);
  }

  async updateParticipantStatus(
    eventId: string,
    participantId: string,
    status: ParticipationStatus,
    user: User,
  ): Promise<EventParticipant> {
    const event = await this.findOne(eventId);

    // Yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Katılımcı durumunu güncelleme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Katılımcıyı bul
    const participant = await this.participantRepository.findOne({
      where: { id: participantId, eventId },
      relations: ['user'],
    });

    if (!participant) {
      throw new NotFoundException('Katılımcı bulunamadı');
    }

    // Onay durumu değişiyor mu kontrol et
    const wasConfirmed = participant.status === ParticipationStatus.CONFIRMED;

    // Güncelle
    participant.status = status;
    await this.participantRepository.save(participant);

    // Onaylanan katılımcı sayısını güncelle
    if (!wasConfirmed && status === ParticipationStatus.CONFIRMED) {
      event.confirmedParticipantCount += 1;
      await this.eventRepository.save(event);
    } else if (wasConfirmed && status !== ParticipationStatus.CONFIRMED) {
      event.confirmedParticipantCount -= 1;
      await this.eventRepository.save(event);
    }

    return participant;
  }

  async updateParticipant(
    eventId: string,
    participantId: string,
    updateParticipantDto: UpdateParticipantDto,
    user: User,
  ): Promise<EventParticipant> {
    const event = await this.findOne(eventId);

    // Yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Katılımcı bilgilerini güncelleme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Katılımcıyı bul
    const participant = await this.participantRepository.findOne({
      where: { id: participantId, eventId },
      relations: ['user'],
    });

    if (!participant) {
      throw new NotFoundException('Katılımcı bulunamadı');
    }

    // Status değişiyorsa katılımcı sayısını güncelle
    if (
      updateParticipantDto.status &&
      updateParticipantDto.status !== participant.status
    ) {
      const wasConfirmed = participant.status === ParticipationStatus.CONFIRMED;
      const willBeConfirmed =
        updateParticipantDto.status === ParticipationStatus.CONFIRMED;

      if (!wasConfirmed && willBeConfirmed) {
        event.confirmedParticipantCount += 1;
        await this.eventRepository.save(event);
      } else if (wasConfirmed && !willBeConfirmed) {
        event.confirmedParticipantCount -= 1;
        await this.eventRepository.save(event);
      }
    }

    // Güncelle
    Object.assign(participant, updateParticipantDto);
    return this.participantRepository.save(participant);
  }

  async removeParticipant(
    eventId: string,
    participantId: string,
    user: User,
  ): Promise<boolean> {
    const event = await this.findOne(eventId);

    // Katılımcıyı bul
    const participant = await this.participantRepository.findOne({
      where: { id: participantId, eventId },
    });

    if (!participant) {
      throw new NotFoundException('Katılımcı bulunamadı');
    }

    // Kendisi mi veya yetkisi var mı kontrol et
    if (participant.userId !== user.id && event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Katılımcıyı çıkarma yetkiniz bulunmamaktadır',
        );
      }
    }

    // Katılımcıyı sil
    await this.participantRepository.remove(participant);

    // Etkinliği güncelle
    event.participantCount -= 1;
    if (participant.status === ParticipationStatus.CONFIRMED) {
      event.confirmedParticipantCount -= 1;
    }
    await this.eventRepository.save(event);

    return true;
  }

  // Kontrol noktası metodları

  async getCheckpoints(eventId: string): Promise<EventCheckpoint[]> {
    const event = await this.findOne(eventId);

    return this.eventCheckpointRepository.find({
      where: { eventId: event.id },
      order: { orderIndex: 'ASC' },
    });
  }

  async updateCheckpoint(
    eventId: string,
    checkpointId: string,
    updateCheckpointDto: UpdateCheckpointDto,
    user: User,
  ): Promise<EventCheckpoint> {
    const event = await this.findOne(eventId);

    // Yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Kontrol noktasını güncelleme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Kontrol noktasını bul
    const checkpoint = await this.eventCheckpointRepository.findOne({
      where: { id: checkpointId, eventId },
    });

    if (!checkpoint) {
      throw new NotFoundException('Kontrol noktası bulunamadı');
    }

    // Güncelle
    await this.eventCheckpointRepository.update(
      checkpointId,
      updateCheckpointDto,
    );

    const updatedCheckpoint = await this.eventCheckpointRepository.findOne({
      where: { id: checkpointId },
    });

    if (!updatedCheckpoint) {
      throw new NotFoundException('Güncellenen kontrol noktası bulunamadı');
    }

    return updatedCheckpoint;
  }

  async removeCheckpoint(
    eventId: string,
    checkpointId: string,
    user: User,
  ): Promise<boolean> {
    const event = await this.findOne(eventId);

    // Yetkisi var mı kontrol et
    if (event.creatorId !== user.id) {
      const member = await this.clubsService.getMemberByUserAndClub(
        user.id,
        event.clubId,
      );
      if (!member || !member.canManageEvents) {
        throw new ForbiddenException(
          'Kontrol noktasını silme yetkiniz bulunmamaktadır',
        );
      }
    }

    // Kontrol noktasını bul
    const checkpoint = await this.eventCheckpointRepository.findOne({
      where: { id: checkpointId, eventId },
    });

    if (!checkpoint) {
      throw new NotFoundException('Kontrol noktası bulunamadı');
    }

    // Sil
    await this.eventCheckpointRepository.remove(checkpoint);

    return true;
  }

  // Yardımcı Fonksiyonlar
  private async sendEventNotification(event: Event): Promise<void> {
    // Kulüp üyelerini bul
    const members = await this.clubsService.getClubMembers(event.clubId);

    // Alıcıları oluştur
    const recipients = members.map((member) => ({
      userId: member.userId,
    }));

    if (recipients.length > 0) {
      // Bildirim gönder
      await this.notificationsService.sendToRecipients(
        recipients,
        `Yeni Etkinlik: ${event.title}`,
        `${event.club.name} kulübünde yeni bir etkinlik oluşturuldu: ${
          event.title
        }. 
         Etkinlik ${new Date(event.startDate).toLocaleDateString(
           'tr-TR',
         )} tarihinde başlayacak.`,
        NotificationType.PUSH,
        { eventId: event.id, clubId: event.clubId },
      );
    }
  }

  private async sendEventStatusChangeNotification(event: Event): Promise<void> {
    // Etkinlik katılımcılarını bul
    const participants = await this.participantRepository.find({
      where: { eventId: event.id },
      relations: ['user'],
    });

    // Alıcıları oluştur
    const recipients = participants.map((participant) => ({
      userId: participant.userId,
    }));

    if (recipients.length > 0) {
      // Bildirim gönder
      let message = '';

      switch (event.status) {
        case EventStatus.CANCELLED:
          message = `"${event.title}" etkinliği iptal edildi.`;
          break;
        case EventStatus.ONGOING:
          message = `"${event.title}" etkinliği başladı!`;
          break;
        case EventStatus.COMPLETED:
          message = `"${event.title}" etkinliği tamamlandı.`;
          break;
        default:
          message = `"${event.title}" etkinliğinin durumu güncellendi: ${event.status}`;
      }

      await this.notificationsService.sendToRecipients(
        recipients,
        `Etkinlik Güncellemesi: ${event.title}`,
        message,
        NotificationType.PUSH,
        { eventId: event.id, clubId: event.clubId, status: event.status },
      );
    }
  }

  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    const event = await this.findOne(eventId);

    return this.participantRepository.find({
      where: { eventId: event.id },
      relations: ['user'],
    });
  }

  async getParticipants(eventId: string): Promise<EventParticipant[]> {
    return this.getEventParticipants(eventId);
  }

  /**
   * Belirli bir kulüp için etkinlikleri belirli tarih aralığında getirir
   */
  async findByClub(
    clubId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    return this.eventRepository.find({
      where: {
        clubId,
        startDate: Between(startDate, endDate),
      },
      relations: ['club', 'creator', 'participants'],
      order: {
        startDate: 'ASC',
      },
    });
  }

  /**
   * Belirli bir kulüp şehri için etkinlikleri belirli tarih aralığında getirir
   */
  async findByClubCity(
    clubCityId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    return this.eventRepository.find({
      where: {
        clubCityId,
        startDate: Between(startDate, endDate),
      },
      relations: ['club', 'creator', 'clubCity', 'participants'],
      order: {
        startDate: 'ASC',
      },
    });
  }
}

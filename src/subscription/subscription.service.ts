import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { User } from '../users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { Club } from '../clubs/entities/club.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, user: User) {
    const club = await this.clubRepository.findOne({
      where: { id: createSubscriptionDto.clubId },
    });

    if (!club) {
      throw new NotFoundException('Kulüp bulunamadı');
    }

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      user,
      club,
      isActive: true,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async findByClub(clubId: string, user: User) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        club: { id: clubId },
        user: { id: user.id },
        isActive: true,
      },
      relations: ['club', 'user'],
    });

    if (!subscription) {
      throw new NotFoundException('Aktif abonelik bulunamadı');
    }

    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    user: User,
  ) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!subscription) {
      throw new NotFoundException('Abonelik bulunamadı');
    }

    if (subscription.user.id !== user.id) {
      throw new ForbiddenException('Bu aboneliği güncelleme yetkiniz yok');
    }

    Object.assign(subscription, updateSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: string, user: User) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!subscription) {
      throw new NotFoundException('Abonelik bulunamadı');
    }

    if (subscription.user.id !== user.id) {
      throw new ForbiddenException('Bu aboneliği iptal etme yetkiniz yok');
    }

    subscription.isActive = false;
    return this.subscriptionRepository.save(subscription);
  }
}

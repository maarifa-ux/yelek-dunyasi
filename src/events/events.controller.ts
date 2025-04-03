import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { JoinEventDto } from './dto/join-event.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Etkinlikler')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni etkinlik oluştur' })
  create(@Body() createEventDto: CreateEventDto, @AuthUser() user: User) {
    return this.eventsService.create(createEventDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm etkinlikleri listele' })
  findAll(
    @Query('clubId') clubId: string,
    @Query('status') status: string,
    @Query('type') type: string,
    @Query('fromDate') fromDate: string,
  ) {
    return this.eventsService.findAll(clubId, status, type, fromDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Etkinlik detaylarını getir' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Etkinlik bilgilerini güncelle' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @AuthUser() user: User,
  ) {
    return this.eventsService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Etkinlik sil' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.eventsService.remove(id, user);
  }

  // Kontrol noktaları
  @Post(':id/checkpoints')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Etkinliğe kontrol noktası ekle' })
  addCheckpoint(
    @Param('id') eventId: string,
    @Body() createCheckpointDto: CreateCheckpointDto,
    @AuthUser() user: User,
  ) {
    return this.eventsService.addCheckpoint(eventId, createCheckpointDto, user);
  }

  @Get(':id/checkpoints')
  @ApiOperation({ summary: 'Etkinlik kontrol noktalarını listele' })
  getCheckpoints(@Param('id') eventId: string) {
    return this.eventsService.getCheckpoints(eventId);
  }

  @Patch(':id/checkpoints/:checkpointId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kontrol noktası güncelle' })
  updateCheckpoint(
    @Param('id') eventId: string,
    @Param('checkpointId') checkpointId: string,
    @Body() updateCheckpointDto: UpdateCheckpointDto,
    @AuthUser() user: User,
  ) {
    return this.eventsService.updateCheckpoint(
      eventId,
      checkpointId,
      updateCheckpointDto,
      user,
    );
  }

  @Delete(':id/checkpoints/:checkpointId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kontrol noktası sil' })
  removeCheckpoint(
    @Param('id') eventId: string,
    @Param('checkpointId') checkpointId: string,
    @AuthUser() user: User,
  ) {
    return this.eventsService.removeCheckpoint(eventId, checkpointId, user);
  }

  // Katılımcılar
  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Etkinliğe katıl' })
  joinEvent(
    @Param('id') eventId: string,
    @Body() joinEventDto: JoinEventDto,
    @AuthUser() user: User,
  ) {
    return this.eventsService.joinEvent(eventId, joinEventDto, user);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Etkinlik katılımcılarını listele' })
  getParticipants(@Param('id') eventId: string) {
    return this.eventsService.getEventParticipants(eventId);
  }

  @Patch(':id/participants/:participantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Katılımcı durumunu güncelle' })
  updateParticipant(
    @Param('id') eventId: string,
    @Param('participantId') participantId: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
    @AuthUser() user: User,
  ) {
    return this.eventsService.updateParticipant(
      eventId,
      participantId,
      updateParticipantDto,
      user,
    );
  }

  @Delete(':id/participants/:participantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Katılımcı çıkar' })
  removeParticipant(
    @Param('id') eventId: string,
    @Param('participantId') participantId: string,
    @AuthUser() user: User,
  ) {
    return this.eventsService.removeParticipant(eventId, participantId, user);
  }
}

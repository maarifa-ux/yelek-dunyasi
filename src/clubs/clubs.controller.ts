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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateClubNoteDto } from './dto/create-club-note.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AddCityDto } from './dto/add-city.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Kulüpler')
@Controller({
  path: 'clubs',
  version: '1',
})
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kulüp oluştur' })
  create(@Body() createClubDto: CreateClubDto, @AuthUser() user: User) {
    return this.clubsService.create(createClubDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kulüpleri listele' })
  findAll(@Query('search') search: string, @Query('type') type: string) {
    return this.clubsService.findAll(search, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kulüp detaylarını getir' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp bilgilerini güncelle' })
  update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.update(id, updateClubDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp sil' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.clubsService.remove(id, user);
  }

  // Üye yönetimi
  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulübe üye ekle' })
  addMember(
    @Param('id') clubId: string,
    @Body() addMemberDto: AddMemberDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.addMember(clubId, addMemberDto, user);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Kulüp üyelerini listele' })
  getMembers(@Param('id') clubId: string) {
    return this.clubsService.getMembers(clubId);
  }

  @Patch(':id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Üye bilgilerini güncelle' })
  updateMember(
    @Param('id') clubId: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.updateMember(
      clubId,
      memberId,
      updateMemberDto,
      user,
    );
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Üye sil' })
  removeMember(
    @Param('id') clubId: string,
    @Param('memberId') memberId: string,
    @AuthUser() user: User,
  ) {
    return this.clubsService.removeMember(clubId, memberId, user);
  }

  // Duyurular
  @Post(':id/announcements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp duyurusu oluştur' })
  createAnnouncement(
    @Param('id') clubId: string,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.createAnnouncement(
      clubId,
      createAnnouncementDto,
      user,
    );
  }

  @Get(':id/announcements')
  @ApiOperation({ summary: 'Kulüp duyurularını listele' })
  getAnnouncements(@Param('id') clubId: string) {
    return this.clubsService.getAnnouncements(clubId);
  }

  // Notlar
  @Post(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp notu oluştur' })
  createNote(
    @Param('id') clubId: string,
    @Body() createClubNoteDto: CreateClubNoteDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.createNote(clubId, createClubNoteDto, user);
  }

  @Get(':id/notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp notlarını listele' })
  getNotes(@Param('id') clubId: string) {
    return this.clubsService.getNotes(clubId);
  }

  // Davetiyeler
  @Post(':id/invitations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp davetiyesi oluştur' })
  createInvitation(
    @Param('id') clubId: string,
    @Body() createInvitationDto: CreateInvitationDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.createInvitation(
      clubId,
      createInvitationDto,
      user,
    );
  }

  // Şehirler
  @Post(':id/cities')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulübe şehir ekle' })
  addCity(
    @Param('id') clubId: string,
    @Body() addCityDto: AddCityDto,
    @AuthUser() user: User,
  ) {
    return this.clubsService.addCity(clubId, addCityDto, user);
  }

  @Get(':id/cities')
  @ApiOperation({ summary: 'Kulüp şehirlerini listele' })
  getCities(@Param('id') clubId: string) {
    return this.clubsService.getCities(clubId);
  }
}

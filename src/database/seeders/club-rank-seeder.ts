import { DataSource } from 'typeorm';
import {
  ClubRank,
  MemberStatus,
} from '../../clubs/entities/club-member.entity';
import { ClubRoleSetting } from '../../clubs/entities/club-role-setting.entity';
import { ClubStatus, ClubType } from '../../clubs/entities/club.entity';

// Her rol için açıklama ve izinlerini tanımlayan yardımcı yapılar
const CLUB_RANK_SETTINGS = [
  {
    rank: ClubRank.GENERAL_PRESIDENT,
    description: 'Genel Başkan',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: true,
    canSendAnnouncement: true,
    canAddProduct: true,
    canManageClub: true,
    canRemoveMember: true,
    canManageEvents: true,
  },
  {
    rank: ClubRank.GENERAL_COACH,
    description: 'Genel Koç',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: true,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.GENERAL_ROAD_CAPTAIN,
    description: 'Genel Yol Kaptanı',
    canCreateEvent: true,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.GENERAL_COORDINATOR,
    description: 'Genel Koordinatör',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: true,
    canSendAnnouncement: true,
    canAddProduct: true,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.GENERAL_DISCIPLINE,
    description: 'Genel Disiplin Sorumlusu',
    canCreateEvent: false,
    canManageMembers: true,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: true,
    canManageEvents: false,
  },
  {
    rank: ClubRank.GENERAL_TREASURER,
    description: 'Genel Sayman',
    canCreateEvent: false,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: true,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: false,
  },
  {
    rank: ClubRank.CITY_PRESIDENT,
    description: 'Şehir Başkanı',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: true,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.CITY_COACH,
    description: 'Şehir Koçu',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.CITY_ROAD_CAPTAIN,
    description: 'Şehir Yol Kaptanı',
    canCreateEvent: true,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.CITY_COORDINATOR,
    description: 'Şehir Koordinatörü',
    canCreateEvent: true,
    canManageMembers: true,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: true,
  },
  {
    rank: ClubRank.CITY_DISCIPLINE,
    description: 'Şehir Disiplin Sorumlusu',
    canCreateEvent: false,
    canManageMembers: true,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: true,
    canManageEvents: false,
  },
  {
    rank: ClubRank.CITY_TREASURER,
    description: 'Şehir Saymanı',
    canCreateEvent: false,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: true,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: false,
  },
  {
    rank: ClubRank.MEMBER,
    description: 'Üye',
    canCreateEvent: false,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: false,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: false,
  },
  {
    rank: ClubRank.PROSPECT,
    description: 'Aday Üye',
    canCreateEvent: false,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: false,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: false,
  },
  {
    rank: ClubRank.HANGAROUND,
    description: 'Misafir Üye',
    canCreateEvent: false,
    canManageMembers: false,
    canManageCity: false,
    canSendAnnouncement: false,
    canAddProduct: false,
    canManageClub: false,
    canRemoveMember: false,
    canManageEvents: false,
  },
];

export const seedClubRanks = async (dataSource: DataSource): Promise<void> => {
  try {
    // ClubRoleSetting tablosunu kullanarak veritabanına ekleyelim
    const clubRoleSettingRepository = dataSource.getRepository(ClubRoleSetting);

    // Mevcut rol ayarlarını kontrol edelim
    const existingRoleSettings = await clubRoleSettingRepository.find();
    console.log(
      `Mevcut rol ayarları: ${existingRoleSettings.length} kayıt bulundu.`,
    );

    console.log('---- Kulüp Rolleri ve İzinleri ----');

    // Her bir rol için ayarları ekleyelim veya güncelleyelim
    for (const setting of CLUB_RANK_SETTINGS) {
      // Mevcut kaydı ara
      const existingRole = existingRoleSettings.find(
        (r) => r.rank === setting.rank,
      );

      if (existingRole) {
        // Mevcut kaydı güncelle
        Object.assign(existingRole, setting);

        await clubRoleSettingRepository.save(existingRole);
        console.log(`${setting.rank} rolü güncellendi.`);
      } else {
        // Yeni kayıt oluştur
        const newRoleSetting = clubRoleSettingRepository.create(setting as any);

        await clubRoleSettingRepository.save(newRoleSetting);
        console.log(`${setting.rank} rolü eklendi.`);
      }
    }

    console.log('Kulüp rol bilgileri başarıyla kaydedildi.');
  } catch (error) {
    console.error('Kulüp rolleri işlenirken hata oluştu:', error);
    throw error;
  }
};

// Kulüp üyelik durumları için seeder
export const seedMemberStatuses = async (
  dataSource: DataSource,
): Promise<void> => {
  try {
    // MemberStatus enum değerlerini burada işleyebilirsiniz
    console.log('---- Kulüp Üyelik Durumları ----');
    const memberStatusDescriptions = {
      [MemberStatus.ACTIVE]: 'Aktif',
      [MemberStatus.INACTIVE]: 'Pasif',
      [MemberStatus.SUSPENDED]: 'Askıya Alınmış',
      [MemberStatus.PENDING]: 'Beklemede',
      [MemberStatus.REJECTED]: 'Reddedilmiş',
    };

    Object.entries(memberStatusDescriptions).forEach(
      ([status, description]) => {
        console.log(`${status}: ${description}`);
      },
    );

    console.log('Kulüp üyelik durumları başarıyla hazırlandı.');
  } catch (error) {
    console.error('Kulüp üyelik durumları işlenirken hata oluştu:', error);
    throw error;
  }
};

// Kulüp tipleri için seeder
export const seedClubTypes = async (dataSource: DataSource): Promise<void> => {
  try {
    console.log('---- Kulüp Tipleri ----');
    const clubTypeDescriptions = {
      [ClubType.PUBLIC]: 'Herkese Açık',
      [ClubType.PRIVATE]: 'Özel',
    };

    Object.entries(clubTypeDescriptions).forEach(([type, description]) => {
      console.log(`${type}: ${description}`);
    });

    console.log('Kulüp tipleri başarıyla hazırlandı.');
  } catch (error) {
    console.error('Kulüp tipleri işlenirken hata oluştu:', error);
    throw error;
  }
};

// Kulüp durumları için seeder
export const seedClubStatuses = async (
  dataSource: DataSource,
): Promise<void> => {
  try {
    console.log('---- Kulüp Durumları ----');
    const clubStatusDescriptions = {
      [ClubStatus.ACTIVE]: 'Aktif',
      [ClubStatus.SUSPENDED]: 'Askıya Alınmış',
      [ClubStatus.INACTIVE]: 'Pasif',
    };

    Object.entries(clubStatusDescriptions).forEach(([status, description]) => {
      console.log(`${status}: ${description}`);
    });

    console.log('Kulüp durumları başarıyla hazırlandı.');
  } catch (error) {
    console.error('Kulüp durumları işlenirken hata oluştu:', error);
    throw error;
  }
};

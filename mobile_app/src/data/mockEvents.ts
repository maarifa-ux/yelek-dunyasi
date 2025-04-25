import {Event} from '../services/eventService';

// Şu anki tarih
const currentDate = new Date();

// Yaklaşan etkinlikler için mock veri
export const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Belgrad Ormanı Bisiklet Turu',
    description:
      'Belgrad Ormanında keyifli bir hafta sonu bisiklet turu. Doğa içerisinde yaklaşık 25 kmlik bir rota izleyeceğiz.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
    startDate: new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 3 gün sonra
    endDate: new Date(
      currentDate.getTime() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
    ).toISOString(), // 3 gün sonra + 4 saat
    location: {
      title: 'Belgrad Ormanı',
      latitude: 41.182732,
      longitude: 28.994152,
      city: 'İstanbul',
      district: 'Sarıyer',
      address: 'Belgrad Ormanı Giriş Kapısı, Bahçeköy',
    },
    route: {
      startPoint: {
        title: 'Belgrad Ormanı Giriş',
        latitude: 41.182732,
        longitude: 28.994152,
      },
      endPoint: {
        title: 'Neşet Suyu',
        latitude: 41.212601,
        longitude: 28.987887,
      },
      waypoints: [
        {
          title: 'Bendler',
          latitude: 41.196742,
          longitude: 28.989423,
        },
      ],
      distance: 25.5, // kilometre
      duration: 120, // dakika
    },
    maxParticipants: 30,
    currentParticipants: 18,
    organizerId: 'org1',
    organizer: {
      id: 'org1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    clubId: 'club1',
    club: {
      id: 'club1',
      name: 'İstanbul Bisiklet Kulübü',
      logoUrl: 'https://placehold.co/200x200/orange/white?text=İBK',
    },
    eventType: 'RIDE',
    status: 'UPCOMING',
    isPrivate: false,
    participationStatus: 'JOINED',
    participants: Array.from({length: 18}, (_, i) => ({
      id: `user${i + 1}`,
      firstName: `Katılımcı${i + 1}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'men' : 'women'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['bisiklet', 'doğa', 'hafta sonu'],
  },
  {
    id: '2',
    title: 'Şehir İçi Gece Sürüşü',
    description:
      'Şehrin ışıkları altında keyifli bir gece sürüşü. Boğaz kıyısını takip edeceğiz.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1583467875263-d50dec37a88c',
    startDate: new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 7 gün sonra
    endDate: new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
    ).toISOString(), // 7 gün sonra + 3 saat
    location: {
      title: 'Bebek Parkı',
      latitude: 41.078664,
      longitude: 29.042605,
      city: 'İstanbul',
      district: 'Beşiktaş',
      address: 'Bebek Mahallesi, Cevdet Paşa Caddesi, Bebek Parkı',
    },
    route: {
      startPoint: {
        title: 'Bebek Parkı',
        latitude: 41.078664,
        longitude: 29.042605,
      },
      endPoint: {
        title: 'Ortaköy Meydanı',
        latitude: 41.047226,
        longitude: 29.026861,
      },
      waypoints: [
        {
          title: 'Arnavutköy',
          latitude: 41.064794,
          longitude: 29.039481,
        },
      ],
      distance: 15.3, // kilometre
      duration: 80, // dakika
    },
    maxParticipants: 20,
    currentParticipants: 12,
    organizerId: 'org2',
    organizer: {
      id: 'org2',
      firstName: 'Zeynep',
      lastName: 'Kaya',
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    eventType: 'RIDE',
    status: 'UPCOMING',
    isPrivate: false,
    participationStatus: 'NONE',
    participants: Array.from({length: 12}, (_, i) => ({
      id: `user${i + 20}`,
      firstName: `Katılımcı${i + 20}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'women' : 'men'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['gece sürüşü', 'şehir içi', 'boğaz'],
  },
  {
    id: '3',
    title: 'Bisiklet Bakım Atölyesi',
    description:
      'Bisiklet bakımı hakkında temel bilgiler edinebileceğiniz atölye çalışması. Zincir bakımı, fren ayarları ve lastik değişimi gibi konular ele alınacak.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1603102859961-64b17d43580d',
    startDate: new Date(
      currentDate.getTime() + 10 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 10 gün sonra
    endDate: new Date(
      currentDate.getTime() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ).toISOString(), // 10 gün sonra + 2 saat
    location: {
      title: 'Kadıköy Bisiklet Evi',
      latitude: 40.991682,
      longitude: 29.027889,
      city: 'İstanbul',
      district: 'Kadıköy',
      address: 'Caferağa Mahallesi, Moda Caddesi No: 54',
    },
    maxParticipants: 15,
    currentParticipants: 8,
    organizerId: 'org3',
    organizer: {
      id: 'org3',
      firstName: 'Mehmet',
      lastName: 'Demir',
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    clubId: 'club2',
    club: {
      id: 'club2',
      name: 'Kadıköy Bisiklet Topluluğu',
      logoUrl: 'https://placehold.co/200x200/purple/white?text=KBT',
    },
    eventType: 'TRAINING',
    status: 'UPCOMING',
    isPrivate: false,
    participationStatus: 'PENDING',
    participants: Array.from({length: 8}, (_, i) => ({
      id: `user${i + 40}`,
      firstName: `Katılımcı${i + 40}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'men' : 'women'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['eğitim', 'bakım', 'atölye'],
  },
];

// Geçmiş etkinlikler için mock veri
export const pastEvents: Event[] = [
  {
    id: '4',
    title: 'Büyükada Turu',
    description:
      'Büyükadada keyifli bir gün geçirmek için düzenlenen bisiklet turu. Adanın etrafını tamamen dolaşacağız.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1605283894576-f8f1d15c8c69',
    startDate: new Date(
      currentDate.getTime() - 20 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 20 gün önce
    endDate: new Date(
      currentDate.getTime() - 20 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
    ).toISOString(), // 20 gün önce + 6 saat
    location: {
      title: 'Büyükada İskele Meydanı',
      latitude: 40.876721,
      longitude: 29.118269,
      city: 'İstanbul',
      district: 'Adalar',
      address: 'Büyükada, İskele Meydanı',
    },
    route: {
      startPoint: {
        title: 'Büyükada İskele Meydanı',
        latitude: 40.876721,
        longitude: 29.118269,
      },
      endPoint: {
        title: 'Büyükada İskele Meydanı',
        latitude: 40.876721,
        longitude: 29.118269,
      },
      waypoints: [
        {
          title: 'Aya Yorgi Tepesi',
          latitude: 40.855927,
          longitude: 29.119286,
        },
      ],
      distance: 18.2, // kilometre
      duration: 180, // dakika
    },
    maxParticipants: 25,
    currentParticipants: 22,
    organizerId: 'org1',
    organizer: {
      id: 'org1',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    clubId: 'club1',
    club: {
      id: 'club1',
      name: 'İstanbul Bisiklet Kulübü',
      logoUrl: 'https://placehold.co/200x200/orange/white?text=İBK',
    },
    eventType: 'RIDE',
    status: 'COMPLETED',
    isPrivate: false,
    participationStatus: 'JOINED',
    participants: Array.from({length: 22}, (_, i) => ({
      id: `user${i + 60}`,
      firstName: `Katılımcı${i + 60}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'women' : 'men'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['ada', 'tur', 'deniz'],
  },
  {
    id: '5',
    title: 'Yeni Başlayanlar için Bisiklet Eğitimi',
    description:
      'Bisiklete yeni başlayanlar için temel sürüş teknikleri, trafik kuralları ve güvenli sürüş hakkında bilgilendirme eğitimi.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b',
    startDate: new Date(
      currentDate.getTime() - 15 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 15 gün önce
    endDate: new Date(
      currentDate.getTime() - 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
    ).toISOString(), // 15 gün önce + 3 saat
    location: {
      title: 'Caddebostan Sahili',
      latitude: 40.962314,
      longitude: 29.056761,
      city: 'İstanbul',
      district: 'Kadıköy',
      address: 'Caddebostan Mahallesi, Bağdat Caddesi, Caddebostan Sahili',
    },
    maxParticipants: 15,
    currentParticipants: 12,
    organizerId: 'org3',
    organizer: {
      id: 'org3',
      firstName: 'Mehmet',
      lastName: 'Demir',
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    clubId: 'club2',
    club: {
      id: 'club2',
      name: 'Kadıköy Bisiklet Topluluğu',
      logoUrl: 'https://placehold.co/200x200/purple/white?text=KBT',
    },
    eventType: 'TRAINING',
    status: 'COMPLETED',
    isPrivate: false,
    participationStatus: 'JOINED',
    participants: Array.from({length: 12}, (_, i) => ({
      id: `user${i + 80}`,
      firstName: `Katılımcı${i + 80}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'men' : 'women'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['eğitim', 'başlangıç', 'güvenlik'],
  },
  {
    id: '6',
    title: 'Bisiklet Festivali',
    description:
      'Tüm bisiklet severlerin bir araya geleceği festival. Yarışmalar, atölyeler, sergiler ve eğlenceli aktiviteler.',
    coverPhotoUrl:
      'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734',
    startDate: new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 30 gün önce
    endDate: new Date(
      currentDate.getTime() - 29 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 29 gün önce (2 günlük etkinlik)
    location: {
      title: 'Yenikapı Etkinlik Alanı',
      latitude: 41.002281,
      longitude: 28.953291,
      city: 'İstanbul',
      district: 'Fatih',
      address: 'Yenikapı Etkinlik Alanı, Kennedy Caddesi',
    },
    maxParticipants: 500,
    currentParticipants: 354,
    organizerId: 'org4',
    organizer: {
      id: 'org4',
      firstName: 'Ayşe',
      lastName: 'Öztürk',
      profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    eventType: 'MEETING',
    status: 'COMPLETED',
    isPrivate: false,
    participationStatus: 'NONE',
    participants: Array.from({length: 20}, (_, i) => ({
      id: `user${i + 100}`,
      firstName: `Katılımcı${i + 100}`,
      lastName: 'Soyad',
      profilePicture: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? 'women' : 'men'
      }/${(i % 10) + 1}.jpg`,
    })),
    tags: ['festival', 'topluluk', 'yarışma'],
  },
];

// Tüm etkinlikleri bir araya getir
export const allEvents: Event[] = [...upcomingEvents, ...pastEvents];

// Verileri takvim görünümü için hazırla
export const calendarEvents = allEvents.reduce((acc, event) => {
  const startDate = event.startDate.split('T')[0]; // Tarih kısmını al (YYYY-MM-DD)

  if (!acc[startDate]) {
    acc[startDate] = [];
  }

  acc[startDate].push(event);
  return acc;
}, {} as Record<string, Event[]>);

export default {
  upcomingEvents,
  pastEvents,
  allEvents,
  calendarEvents,
};

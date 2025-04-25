import {Club} from '../services/clubService';

export const mockClubs: Club[] = [
  {
    id: 'club1',
    name: 'TürkRiders CC İzmir',
    description:
      "İzmir'de motosiklet kulübü. Her hafta düzenli turlar ve aktiviteler düzenliyoruz.",
    logoUrl: 'https://turkriders.org/wp-content/uploads/2019/07/Trcc-Logo.png',
    coverPhotoUrl:
      'https://www.shutterstock.com/image-photo/night-long-exposure-shot-custom-600nw-2350697899.jpg',
    memberCount: 358,
    isJoined: true,
    city: 'İzmir',
    district: 'Balçova',
    socialMedia: {
      instagram: 'turkridersccizmir',
      facebook: 'turkridersccizmir',
      website: 'www.turkridersccizmir.org',
    },
    tags: ['şehir içi', 'sürüş', 'tur', 'eğitim'],
    foundedYear: 2005,
    admins: [
      {
        id: 'admin1',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        id: 'admin2',
        firstName: 'Ayşe',
        lastName: 'Demir',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    ],
  },
  {
    id: 'club2',
    name: 'TürkRiders CC İstanbul',
    description:
      'İstanbul merkezli motosiklet kulübü. Her hafta düzenli turlar ve aktiviteler düzenliyoruz.',
    logoUrl: 'https://turkriders.org/wp-content/uploads/2019/07/Trcc-Logo.png',
    coverPhotoUrl:
      'https://www.shutterstock.com/image-photo/night-long-exposure-shot-custom-600nw-2350697899.jpg',
    memberCount: 124,
    isJoined: false,
    city: 'İstanbul',
    district: 'Kadıköy',
    socialMedia: {
      instagram: 'kadikoy_bisiklet',
    },
    tags: ['rekreasyon', 'şehir içi', 'eğitim'],
    foundedYear: 2015,
    admins: [
      {
        id: 'admin3',
        firstName: 'Mehmet',
        lastName: 'Demir',
        profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    ],
  },
  {
    id: 'club3',
    name: 'TürkRiders CC Ankara',
    description:
      "Ankara'da motosiklet kültürünü yaygınlaştırmak için çalışan dernek. Motosiklet yolu projeleri, savunuculuk ve farkındalık çalışmaları.",
    logoUrl: 'https://turkriders.org/wp-content/uploads/2019/07/Trcc-Logo.png',
    coverPhotoUrl:
      'https://www.shutterstock.com/image-photo/night-long-exposure-shot-custom-600nw-2350697899.jpg',
    memberCount: 276,
    isJoined: false,
    city: 'Ankara',
    district: 'Çankaya',
    socialMedia: {
      instagram: 'ankarabisiklet',
      facebook: 'ankarabisiklet',
      twitter: 'ankarabisiklet',
      website: 'www.ankarabisiklet.org',
    },
    tags: ['savunuculuk', 'eğitim', 'topluluk'],
    foundedYear: 2008,
    admins: [
      {
        id: 'admin4',
        firstName: 'Zeynep',
        lastName: 'Kaya',
        profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
      },
      {
        id: 'admin5',
        firstName: 'Ali',
        lastName: 'Yıldız',
        profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
      },
    ],
  },
  {
    id: 'club4',
    name: 'TürkRiders CC Mersin',
    description:
      "Mersin'de motosiklet sürenler için sosyal grup. Haftaiçi ve haftasonu turları, sosyal etkinlikler.",
    logoUrl: 'https://turkriders.org/wp-content/uploads/2019/07/Trcc-Logo.png',
    coverPhotoUrl:
      'https://www.shutterstock.com/image-photo/night-long-exposure-shot-custom-600nw-2350697899.jpg',
    memberCount: 189,
    isJoined: false,
    city: 'İzmir',
    district: 'Konak',
    socialMedia: {
      instagram: 'izmirbisiklet',
    },
    tags: ['sosyal', 'rekreasyon', 'tur'],
    foundedYear: 2018,
    admins: [
      {
        id: 'admin6',
        firstName: 'Burak',
        lastName: 'Şahin',
        profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
    ],
  },
  {
    id: 'club5',
    name: 'TürkRiders CC Konya',
    description:
      'Konya merkezli motosiklet kulübü. Her hafta düzenli turlar ve aktiviteler düzenliyoruz.',
    logoUrl: 'https://turkriders.org/wp-content/uploads/2019/07/Trcc-Logo.png',
    coverPhotoUrl:
      'https://www.shutterstock.com/image-photo/night-long-exposure-shot-custom-600nw-2350697899.jpg',
    memberCount: 142,
    isJoined: false,
    city: 'Konya',
    district: 'Konya',
    socialMedia: {
      instagram: 'konyabisiklet',
      facebook: 'konyabisiklet',
    },
    tags: ['dağ bisikleti', 'offroad', 'doğa'],
    foundedYear: 2016,
    admins: [
      {
        id: 'admin7',
        firstName: 'Deniz',
        lastName: 'Yılmaz',
        profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg',
      },
      {
        id: 'admin8',
        firstName: 'Can',
        lastName: 'Özkan',
        profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
      },
    ],
  },
];

export default mockClubs;

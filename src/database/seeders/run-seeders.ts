import { DataSource } from 'typeorm';
import { seedRoles } from './role-seeder';
import { seedStatuses } from './status-seeder';
import {
  seedClubRanks,
  seedMemberStatuses,
  seedClubTypes,
  seedClubStatuses,
} from './club-rank-seeder';
import { CitiesSeed } from '../seeds/cities/cities.seed';
import { City } from '../../cities/entities/city.entity';
import * as dotenv from 'dotenv';
import { join } from 'path';

// .env dosyasını yükle
dotenv.config();

async function runSeeders() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'yelekdunyasi.cdkugmi6qnk2.eu-north-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    password: 'yelekdunyasi',
    database: 'postgres',
    entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await dataSource.initialize();
    console.log('Veritabanı bağlantısı başarılı.');

    // Genel sistem seeder'ları
    console.log("\n--- Sistem Rol ve Durum Seeder'ları Çalıştırılıyor ---");
    await seedRoles(dataSource);
    await seedStatuses(dataSource);

    // Kulüp seeder'ları
    console.log("\n--- Kulüp Rol ve Durum Seeder'ları Çalıştırılıyor ---");
    await seedClubRanks(dataSource);
    await seedMemberStatuses(dataSource);
    await seedClubTypes(dataSource);
    await seedClubStatuses(dataSource);

    // Şehir seeder'ı
    console.log("\n--- Şehir Seeder'ı Çalıştırılıyor ---");
    const citiesSeed = new CitiesSeed(dataSource.getRepository(City));
    await citiesSeed.run();

    console.log('\nTüm seeder işlemleri tamamlandı.');
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Veritabanı bağlantısı kapatıldı.');
    }
  }
}

runSeeders().catch(console.error);

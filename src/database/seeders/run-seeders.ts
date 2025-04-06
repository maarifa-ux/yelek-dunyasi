import { DataSource } from 'typeorm';
import { seedRoles } from './role-seeder';
import { seedStatuses } from './status-seeder';
import {
  seedClubRanks,
  seedMemberStatuses,
  seedClubTypes,
  seedClubStatuses,
} from './club-rank-seeder';
import * as dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

async function runSeeders() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'sa',
    password: process.env.DATABASE_PASSWORD || 'sapass',
    database: process.env.DATABASE_NAME || 'yelekli_dunyasi',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    synchronize: false,
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

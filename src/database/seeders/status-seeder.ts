import { DataSource } from 'typeorm';
import { Status } from '../../statuses/entities/status.entity';
import { StatusEnum } from '../../statuses/statuses.enum';

export const seedStatuses = async (dataSource: DataSource): Promise<void> => {
  const statusRepository = dataSource.getRepository(Status);

  // Mevcut status kayıtlarını kontrol et
  const existingStatuses = await statusRepository.find();
  console.log(
    'Mevcut statüler:',
    existingStatuses.map((s) => `${s.id}: ${s.name}`).join(', '),
  );

  // Enum değerlerini al (1, 2, ...) ve bunları string'e çevir
  const statusValues = Object.values(StatusEnum).filter(
    (v) => typeof v === 'number',
  );
  const statusNames = Object.keys(StatusEnum).filter((k) => isNaN(Number(k)));

  // Her bir status için kontrol et
  for (let i = 0; i < statusNames.length; i++) {
    const statusName = statusNames[i];
    const statusId = statusValues[i] as number;

    // Bu status id veritabanında yoksa ekle
    if (!existingStatuses.some((s) => s.id === statusId)) {
      const status = new Status();
      status.id = statusId;
      status.name = statusName;

      await statusRepository.save(status);
      console.log(`Status eklendi: ${statusName} (ID: ${statusId})`);
    }
  }
};

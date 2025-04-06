import { DataSource } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { RoleEnum } from '../../roles/roles.enum';

export const seedRoles = async (dataSource: DataSource): Promise<void> => {
  const roleRepository = dataSource.getRepository(Role);

  // Mevcut rolleri kontrol et
  const existingRoles = await roleRepository.find();
  console.log(
    'Mevcut roller:',
    existingRoles.map((r) => `${r.id}: ${r.name}`).join(', '),
  );

  // Enum değerlerini al (1, 2, ...) ve bunları string'e çevir
  const roleValues = Object.values(RoleEnum).filter(
    (v) => typeof v === 'number',
  );
  const roleNames = Object.keys(RoleEnum).filter((k) => isNaN(Number(k)));

  // Her bir rol için kontrol et
  for (let i = 0; i < roleNames.length; i++) {
    const roleName = roleNames[i];
    const roleId = roleValues[i] as number;

    // Bu role id veritabanında yoksa ekle
    if (!existingRoles.some((r) => r.id === roleId)) {
      const role = new Role();
      role.id = roleId;
      role.name = roleName;

      await roleRepository.save(role);
      console.log(`Rol eklendi: ${roleName} (ID: ${roleId})`);
    }
  }
};

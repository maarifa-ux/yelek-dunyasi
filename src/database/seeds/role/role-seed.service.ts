import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user,
          name: 'User',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user_view,
          name: 'User-View',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.user_edit,
          name: 'User-Edit',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.guest,
          name: 'Guest',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.manager_view,
          name: 'Manager-View',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.manager_edit,
          name: 'Manager-Edit',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.manager_application_spesific,
          name: 'Manager-Spesific-Application',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'Admin',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin_view,
          name: 'Admin-View',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin_edit,
          name: 'Admin-Edit',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin_add,
          name: 'Admin-Add',
        }),
      );
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin_delete,
          name: 'Admin-Delete',
        }),
      );
    }
  }
}

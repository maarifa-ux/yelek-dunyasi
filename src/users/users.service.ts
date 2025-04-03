/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseFactory } from 'src/responses/error-response.factory';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOperator, FindOptionsWhere, Repository, In, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    // null değerleri undefined'a çevir
    const dto = Object.fromEntries(
      Object.entries(createProfileDto).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ]),
    );

    return this.usersRepository.save(this.usersRepository.create(dto));
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: role.id,
      }));
    }

    if (filterOptions?.search) {
      where.firstName = Like(`%${filterOptions.search}%`);
      where.lastName = Like(`%${filterOptions.search}%`);
      where.email = Like(`%${filterOptions.search}%`);
    }

    return this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
  }

  async getUserByEmail(mail: string) {
    const user = await this.usersRepository.findOne({ where: { email: mail } });

    if (!user) {
      throw ErrorResponseFactory.createNotFoundException('User not found.');
    }

    return user;
  }

  async getUserByID(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw ErrorResponseFactory.createNotFoundException('User not found.');
    }

    return user;
  }

  async assignRole(userId: string, roleId: number | FindOperator<number>) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    console.log(role);
    if (!user) {
      throw ErrorResponseFactory.createNotFoundException('User not found.');
    }

    return user;
  }

  isUserExistsByID(id: string) {
    return this.usersRepository.exist({ where: { id } });
  }

  findOne(fields: EntityCondition<User>) {
    return this.usersRepository.findOne({
      where: fields,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // null değerleri undefined'a çevir
    const dto = Object.fromEntries(
      Object.entries(updateUserDto).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ]),
    );

    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...dto,
      }),
    );
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async findById(id: string): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}

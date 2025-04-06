/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Role } from 'src/roles/entities/role.entity';
import { ProfileCompletionController } from './controllers/profile-completion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Role])],
  controllers: [UsersController, ProfileCompletionController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

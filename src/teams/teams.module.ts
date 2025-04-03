import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Invitation } from './entities/invitation.entity';
import { Team } from './entities/teams.entity';
import { TeamMember } from './entities/teams_to_members.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [TeamsService],
  controllers: [TeamsController],
  imports: [
    TypeOrmModule.forFeature([Team, TeamMember, Invitation]),
    JwtModule.registerAsync({
      imports: [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: async () => {
        return {
          secret: 'secret',
        };
      },
      inject: [],
    }),
    UsersModule,
  ],
})
export class TeamsModule {}

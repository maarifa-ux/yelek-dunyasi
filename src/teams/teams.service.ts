import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponseFactory } from 'src/responses/error-response.factory';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateTeamInvitationDTO } from './dto/create-team-invitation.dto';
import { CreateTeamDTO } from './dto/create-team.dto';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { Team } from './entities/teams.entity';
import { TeamMember, TeamMemberRole } from './entities/teams_to_members.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TeamsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly teamToMemberRepository: Repository<TeamMember>,
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async getTeamByID(id: string) {
    const team = await this.teamRepository.findOne({ where: { id: id } });
    // const teamMembers = await this.teamToMemberRepository.find({
    //   where: { teamID: id },
    // });
    // teamMembers.forEach((element) => {
    //   console.log(element.user, element.userID);
    // });

    if (!team) {
      throw ErrorResponseFactory.createNotFoundException('Team not found');
    }

    return team;
  }

  async getTeamList() {
    return await this.teamRepository.find();
  }

  async getTeamByIDetail(id: string) {
    const team = await this.teamRepository.findOne({ where: { id: id } });
    // const teamMembers = await this.teamToMemberRepository.find({
    //   where: { teamID: id },
    // });
    // teamMembers.forEach((element) => {
    //   console.log(element.user, element.userID);
    // });
    const teamDetail = await this.teamToMemberRepository
      .query(`select tm.team_id, t."name" ,tm.user_id, tm."role" , us."firstName", us."lastName", us.email, us."profileImageUrl"
from team_members tm 
inner join public."user" us on us.id  = tm.user_id 
inner join teams t on t.id  = tm.team_id 
where tm.team_id  = '${id}'`);
    if (!team) {
      throw ErrorResponseFactory.createNotFoundException('Team not found');
    }

    return { team, teamDetail };
  }

  async createTeam(newTeam: CreateTeamDTO) {
    const user = await this.userService.getUserByID(newTeam.creatorUserID);

    const team = new Team();
    team.name = newTeam.name;

    const savedTeam = await this.teamRepository.save(team);

    const invitation = new Invitation();
    invitation.team = savedTeam;
    invitation.senderUserID = user.id;
    invitation.receiverUserID = user.id;
    invitation.status = InvitationStatus.ACCEPTED;
    const savedInvitation = await this.invitationRepository.save(invitation);

    const teamMember = new TeamMember();
    teamMember.teamID = team.id;
    teamMember.userID = user.id;
    teamMember.role = TeamMemberRole.ADMIN;
    teamMember.invitationID = savedInvitation.id;
    teamMember.user = user;
    return await this.teamToMemberRepository.save(teamMember);
  }

  async isMemberInTeam(teamID: string, userID: string) {
    return await this.teamToMemberRepository.exist({
      where: { teamID, userID },
    });
  }

  async deleteMemberFromTeam(teamID: string, userID: string, token: string) {
    const json = this.jwtService.decode(token, { json: true }) as {
      uuid: string;
    };

    const checkTeamMember = await this.teamToMemberRepository.findOne({
      where: { userID },
    });
    if (!checkTeamMember) {
      return false;
    }
    const checkSender = await this.teamToMemberRepository.findOne({
      where: { userID: json['id'] },
    });
    if (checkSender?.role != TeamMemberRole.ADMIN) {
      return false;
    }
    const isExist = await this.isMemberInTeam(teamID, userID);
    if (isExist) {
      return await this.teamToMemberRepository.delete({ teamID, userID });
    }
    return false;
  }

  async inviteMember(teamID: string, invitation: CreateTeamInvitationDTO) {
    const team = await this.getTeamByID(teamID);

    const senderUser = await this.userService.getUserByID(
      invitation.senderUserID,
    );
    const receiverUser = await this.userService.getUserByEmail(
      invitation.receiverUserMail,
    );

    const isSenderInTeam = await this.isMemberInTeam(teamID, senderUser.id);

    if (!isSenderInTeam) {
      throw ErrorResponseFactory.createBadRequestException(
        "Sender isn't in the team.",
      );
    }

    const isReceiverInTeam = await this.isMemberInTeam(teamID, receiverUser.id);

    if (isReceiverInTeam) {
      throw ErrorResponseFactory.createBadRequestException(
        'User is already in the team.',
      );
    }

    const isInvited = await this.invitationRepository.exist({
      where: {
        teamID,
        receiverUserID: receiverUser.id,
        status: InvitationStatus.PENDING,
      },
    });

    if (isInvited) {
      throw ErrorResponseFactory.createBadRequestException(
        'User is already invited.',
      );
    }

    const newInvitation = new Invitation();
    newInvitation.team = team;
    newInvitation.senderUser = senderUser;
    newInvitation.receiverUser = receiverUser;
    return await this.invitationRepository.save(newInvitation);
  }

  async rejectInvitation(teamID: string, invitationID: string) {
    const invitation = await this.invitationRepository.findOne({
      where: {
        teamID,
        id: invitationID,
        status: InvitationStatus.PENDING,
      },
    });
    if (!invitation) {
      throw ErrorResponseFactory.createBadRequestException(
        "Invitation doesn't exist.",
      );
    }
    return await this.dataSource.manager.transaction(async (manager) => {
      invitation.status = InvitationStatus.REJECTED;
      await manager.save(invitation);
    });
  }

  async acceptInvitation(teamID: string, invitationID: string) {
    const team = await this.getTeamByID(teamID);

    const invitation = await this.invitationRepository.findOne({
      where: {
        teamID,
        id: invitationID,
        status: InvitationStatus.PENDING,
      },
    });

    if (!invitation) {
      throw ErrorResponseFactory.createBadRequestException(
        "Invitation doesn't exist.",
      );
    }

    return await this.dataSource.manager.transaction(async (manager) => {
      const teamMember = new TeamMember();
      teamMember.teamID = team.id;
      teamMember.userID = invitation.receiverUserID;
      teamMember.role = TeamMemberRole.MEMBER;
      teamMember.invitationID = invitation.id;
      invitation.status = InvitationStatus.ACCEPTED;

      await manager.save(invitation);
      return await manager.save(teamMember);
    });
  }
  async getMyTeams(token: string) {
    const json = this.jwtService.decode(token, { json: true }) as {
      uuid: string;
    };

    const myTeams = await this.teamRepository
      .query(`select tm.team_id, t."name" as team_name  from team_members tm 
inner join teams t on t.id = tm.team_id 
where tm.user_id = '${json['id']}'`);
    return myTeams;
  }
  async listMyInvitation(token: string) {
    const json = this.jwtService.decode(token, { json: true }) as {
      uuid: string;
    };

    const recievedInvitations = await this.teamRepository.query(
      `select i.id as invitation_id, i.teams_id, 
t."name" as team_name, 
u.id as sender_id, u."firstName" as sender_firstname, u."lastName" as sender_lastname
from invitations i 
inner join "user" u on u.id = i.sender_user_id  
inner join teams t on t.id  = i.teams_id
where i.sender_user_id  ='${json['id']}'`,
    );
    const sentInvitations = await this.teamRepository
      .query(`select i.id as invitation_id, i.teams_id, 
t."name" as team_name, 
u.id as reciever_id, u."firstName" as reciever_firstname, u."lastName" as reciever_lastname
from invitations i 
inner join "user" u on u.id = i.receiver_user_id 
inner join teams t on t.id  = i.teams_id
where i.receiver_user_id  ='${json['id']}'`);

    // const receivedInvitations = await this.invitationRepository.find({
    //   where: { receiverUserID: json['id'] },
    // });

    // const sentInvitations = await this.invitationRepository.find({
    //   where: { senderUserID: json['id'] },
    // });
    return {
      recievedInvitations,
      sentInvitations,
    };
  }

  async deleteTeam(teamId: string, token: string) {
    const json = this.jwtService.decode(token, { json: true }) as {
      uuid: string;
    };
    const isTeamMember = this.isMemberInTeam(teamId, json['id']);
    if (!isTeamMember) {
      return false;
    }
    const checkTeamUser = await this.teamToMemberRepository.findAndCount({
      where: { teamID: teamId },
    });
    if (checkTeamUser[1] > 1) {
      throw new HttpException(
        'If team member count is greater than 1, you cant delete team.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.teamToMemberRepository.delete({
      teamID: teamId,
    });
    await this.invitationRepository.delete({ teamID: teamId });
    const deleteTeam = await this.teamRepository.delete({ id: teamId });
    if (deleteTeam.affected! > 0) {
      return true;
    }
    return false;
  }

  async deleteMeFromTeam(teamId: string, token: string) {
    const json = this.jwtService.decode(token, { json: true }) as {
      uuid: string;
    };
    const isTeamMember = this.isMemberInTeam(teamId, json['id']);
    if (!isTeamMember) {
      throw new HttpException(
        'You are not a member of any team',
        HttpStatus.BAD_REQUEST,
      );
    }
    const deleteMe = await this.teamToMemberRepository.delete({
      userID: json['id'],
    });
    if (deleteMe.affected! > 0) {
      return true;
    }
    return false;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeamInvitationDTO } from './dto/create-team-invitation.dto';
import { CreateTeamDTO } from './dto/create-team.dto';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller({
  path: 'teams',
  version: '1',
})
export class TeamsController {
  constructor(private teamsService: TeamsService) {}
  @Get('/by-id/:teamID')
  getTeam(@Param('teamID') teamID: string) {
    return this.teamsService.getTeamByIDetail(teamID);
  }

  @Get('/my-teams')
  myTeams(@Req() request: Request) {
    return this.teamsService.getMyTeams(
      request.headers['authorization'].replace('Bearer ', ''),
    );
  }

  @Get()
  getTeamList() {
    return this.teamsService.getTeamList();
  }

  @Get('/my-invitations')
  myInvitations(@Req() request: Request) {
    return this.teamsService.listMyInvitation(
      request.headers['authorization'].replace('Bearer ', ''),
    );
  }

  @Post('/')
  createTeam(@Body() name: CreateTeamDTO) {
    return this.teamsService.createTeam(name);
  }

  @Post('/:teamID/invites')
  inviteMember(
    @Param('teamID') teamID: string,
    @Body() invitation: CreateTeamInvitationDTO,
  ) {
    return this.teamsService.inviteMember(teamID, invitation);
  }

  @Post('/:teamID/invites/:invitationID/accept')
  acceptInvitation(
    @Param('teamID') teamID: string,
    @Param('invitationID') invitationID: string,
  ) {
    return this.teamsService.acceptInvitation(teamID, invitationID);
  }

  @Post('/:teamID/invites/:invitationID/reject')
  rejectInvitation(
    @Param('teamID') teamID: string,
    @Param('invitationID') invitationID: string,
  ) {
    return this.teamsService.rejectInvitation(teamID, invitationID);
  }

  @Delete('/delete-member/:teamID/:userID')
  deleteMember(
    @Param('teamID') teamID: string,
    @Param('userID') userID: string,
    @Req() request: Request,
  ) {
    return this.teamsService.deleteMemberFromTeam(
      teamID,
      userID,
      request.headers['authorization'].replace('Bearer ', ''),
    );
  }

  @Delete('/delete-me/:teamID')
  deleteMe(@Param('teamID') teamID: string, @Req() request: Request) {
    return this.teamsService.deleteMeFromTeam(
      teamID,
      request.headers['authorization'].replace('Bearer ', ''),
    );
  }

  @Delete('/delete-team/:teamID')
  deleteTeam(@Param('teamID') teamID: string, @Req() request: Request) {
    return this.teamsService.deleteTeam(
      teamID,
      request.headers['authorization'].replace('Bearer ', ''),
    );
  }
}

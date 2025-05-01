import { User } from '../../users/entities/user.entity';
import { ClubApplication } from '../entities/club-application.entity';

export interface OtherClubMembership {
  clubId: string;
  clubName: string;
  memberStatus: string;
  memberRank: string;
  joinDate: Date;
}

export interface OtherClubApplication {
  clubId: string;
  clubName: string;
  status: string;
  applicationDate: Date;
}

export interface EnrichedUser extends User {
  otherClubMemberships: OtherClubMembership[];
  otherClubApplications: OtherClubApplication[];
}

export interface EnrichedClubApplication extends ClubApplication {
  user: EnrichedUser;
}

export interface ClubApplicationsResponse {
  applications: EnrichedClubApplication[];
}

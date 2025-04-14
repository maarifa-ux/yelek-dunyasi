import { User } from '../../users/entities/user.entity';
import {
  ClubRank,
  MemberStatus,
} from '../../clubs/entities/club-member.entity';
import { Event } from '../../events/entities/event.entity';

export interface ClubMembershipDetail {
  clubId: string;
  clubName?: string;
  clubLogo?: string;
  clubCity?: string;
  rank: ClubRank;
  rankDescription?: string;
  permissions?: Record<string, boolean>;
  status: MemberStatus;
  events: Event[];
}

export type LoginResponseType = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
  isProfileCompleted: boolean;
  clubMemberships?: ClubMembershipDetail[]; // Kullanıcının kulüp üyelikleri
};

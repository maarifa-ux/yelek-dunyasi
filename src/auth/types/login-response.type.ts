import { User } from '../../users/entities/user.entity';

export type LoginResponseType = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
  isProfileCompleted: boolean;
};

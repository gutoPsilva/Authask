export type AuthenticatedUser = DiscordUser | LocalUser;

export interface DiscordUser {
  id: number;
  username: string;
  discordId: string;
}

export interface IRegisterLocalUser {
  username: string;
  password: string;
  email: string;
}

export interface IdbUsedDetails {
  username: string;
  email: string;
}

export interface LocalUser {
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface UserLogoutMsg {
  message: string;
  loggedOut: boolean;
}

export interface ResetUserPass {
  token: string;
  password: string;
}

export interface UpdateUserPass {
  password: string;
  newPassword: string;
}

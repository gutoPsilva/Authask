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
export type LocalUserDetails = {
  username: string;
  password: string;
  email: string;
};

export type DiscordUserDetails = {
  discordId: string;
  username: string;
};

export type userStrategy = 'local' | 'discord';

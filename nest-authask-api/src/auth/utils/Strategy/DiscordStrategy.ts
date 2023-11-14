import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ['identify'],
    });
  }

  async validate(
    acessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id: discordId, username } = profile;
    const user = this.authService.validateDiscordUser({ discordId, username });
    return user;
  }
}

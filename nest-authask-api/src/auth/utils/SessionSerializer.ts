import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { DoneCallback } from 'passport';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { userStrategy } from 'src/utils/interfaces_types/user.interface';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {
    super();
  }

  serializeUser(user: LocalUser | DiscordUser, done: DoneCallback) {
    console.log('Serializing user');
    done(null, {
      id: user.id,
      strategy: user instanceof LocalUser ? 'local' : 'discord',
    });
  }

  async deserializeUser(
    sessionUser: { id: number; strategy: userStrategy },
    done: DoneCallback,
  ) {
    console.log('Deserializing user');
    const { id, strategy } = sessionUser;
    console.log(id, strategy);

    try {
      const user =
        strategy === 'local'
          ? await this.userService.findLocalUser({ id: id })
          : await this.userService.findDiscordUser({ id: id });
      return user ? done(null, user) : done(null, null);
    } catch (err) {
      done(err, null);
    }
  }
}

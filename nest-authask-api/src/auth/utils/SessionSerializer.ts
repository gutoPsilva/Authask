import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { DoneCallback } from 'passport';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {
    super();
  }

  serializeUser(localUser: LocalUser, done: DoneCallback) {
    console.log('Serializing user');
    done(null, localUser.id);
  }

  async deserializeUser(id: number, done: DoneCallback) {
    console.log('Deserializing user');
    const userDB = await this.userService.findLocalUserById(id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}

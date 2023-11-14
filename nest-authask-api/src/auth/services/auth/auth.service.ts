import { Inject, Injectable } from '@nestjs/common';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { DiscordUserDetails } from 'src/utils/interfaces e types/user.interface';
import { comparePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  async validateLocalUser(
    username: string,
    password: string,
  ): Promise<LocalUser | null> {
    const userDB = await this.userService.findLocalUser({ username: username });

    // check if user exists and compare if raw password is equal to the hashed password
    if (userDB && (await comparePassword(password, userDB.password))) {
      return userDB;
    }
    return null;
  }

  async validateDiscordUser(
    userDetails: DiscordUserDetails,
  ): Promise<DiscordUser> {
    // it's a signin, so it will only return a user if it exists, otherwise it will create a new user and return it
    console.log('Validating discord user');
    const userDB = await this.userService.findDiscordUser({
      discordId: userDetails.discordId,
    });

    if (!userDB) {
      const newUser = await this.userService.registerDiscordUser(userDetails);
      return newUser;
    }

    return userDB;
  }
}

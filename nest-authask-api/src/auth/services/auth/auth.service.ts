import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
  ) {}

  async validateLocalUser(username: string, password: string) {
    console.log('inside auth.service');
    const userDB = await this.userService.findLocalUserByName(username);

    // check if user exists and compare if raw password is equal to the hashed password
    if (userDB && (await comparePassword(password, userDB.password))) {
      console.log('User validation sucess');
      return userDB;
    }
    console.log('User validation failed');
    return null;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { IRegisterLocalUserParams } from 'src/utils/interfaces e types/user.interface';
import { hashPassword } from 'src/utils/password';
// import { hashPassword } from 'src/utils/password';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(DiscordUser)
    private discordUserRepository: Repository<DiscordUser>,
  ) {}

  async findLocalUserByName(username: string) {
    const userDB = await this.localUserRepository.findOneBy({
      username: username,
    });
    if (!userDB)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return userDB;
  }

  async findLocalUserById(id: number) {
    const userDB = await this.localUserRepository.findOneBy({ id: id });
    if (!userDB)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return userDB;
  }

  async findDiscordUserByName(username: string) {
    const userDB = await this.discordUserRepository.findOneBy({
      username: username,
    });
    if (!userDB)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return userDB;
  }

  findUsers() {
    return this.localUserRepository.find();
  }

  async registerLocalUser(localUserDetails: IRegisterLocalUserParams) {
    console.log('Registering local user...');
    try {
      console.log(localUserDetails.password);
      const password = await hashPassword(localUserDetails.password);
      console.log(password);
      const newUser = this.localUserRepository.create({
        ...localUserDetails,
        password,
      });
      return this.localUserRepository.save(newUser);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

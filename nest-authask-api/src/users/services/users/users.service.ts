import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import {
  DiscordUserDetails,
  LocalUserDetails,
} from 'src/utils/interfaces e types/user.interface';
import { hashPassword } from 'src/utils/password';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(DiscordUser)
    private discordUserRepository: Repository<DiscordUser>,
  ) {}

  async findLocalUser(criteria: Partial<LocalUser>): Promise<LocalUser> {
    const userDB = await this.localUserRepository.findOne({ where: criteria });
    if (!userDB)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    return userDB;
  }

  async registerLocalUser(
    localUserDetails: LocalUserDetails,
  ): Promise<LocalUser> {
    console.log('Registering local user...');

    // MySQL is case-insensitive, so a search of 'gutoPsilva' would return a user even if the username is 'GUTOPSILVA', the same applies to email,
    const emailInUse = await this.localUserRepository.findOneBy({
      email: localUserDetails.email,
    });

    const usernameInUse = await this.localUserRepository.findOneBy({
      username: localUserDetails.username,
    });

    // email && username are unique in the local database, so the user can't register if they are already in use
    if (usernameInUse) {
      throw new HttpException(
        'Username already in use locally',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (emailInUse) {
      throw new HttpException(
        'Email already in use locally',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const password = await hashPassword(localUserDetails.password);
      const newUser = this.localUserRepository.create({
        ...localUserDetails,
        password,
      });
      return await this.localUserRepository.save(newUser);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findDiscordUser(
    criteria: Partial<DiscordUser>,
  ): Promise<DiscordUser | null> {
    const userDB = await this.discordUserRepository.findOne({
      where: criteria,
    });

    // i don't want to send a HttpException, because if the user is not found, it only means that the user never logged in with discord, so it will create a new discord user inside the Entity on authService
    if (!userDB) return null;
    return userDB;
  }

  async registerDiscordUser(
    discordDetails: DiscordUserDetails,
  ): Promise<DiscordUser> {
    const newUser = this.discordUserRepository.create(discordDetails);
    return await this.discordUserRepository.save(newUser);
  }
}

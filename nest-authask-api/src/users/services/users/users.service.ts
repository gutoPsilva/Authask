import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetLocalPassDto } from 'src/auth/dtos/ResetLocalPass.dto';
import { UpdateLocalPassDto } from 'src/auth/dtos/UpdateLocalPass.dto';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { PassTokens } from 'src/entities/PassTokens.entity';
import {
  DiscordUserDetails,
  LocalUserDetails,
} from 'src/utils/interfaces_types/user.interface';
import { comparePassword, hashPassword } from 'src/utils/password';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(LocalUser)
    private localUserRepository: Repository<LocalUser>,
    @InjectRepository(DiscordUser)
    private discordUserRepository: Repository<DiscordUser>,
    @InjectRepository(PassTokens)
    private tokensRepository: Repository<PassTokens>,
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

  // this method is called in cases where the user wants to update his password while logged in
  async updatePassword(updateDto: UpdateLocalPassDto, user: LocalUser) {
    const { password, newPassword } = updateDto;
    const userDB = await this.localUserRepository.findOneBy(user);
    if (!userDB)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const passwordMatch = await comparePassword(password, userDB.password);
    if (!passwordMatch)
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    userDB.password = await hashPassword(newPassword);

    await this.localUserRepository.save(userDB);
    return { message: 'Password updated successfully' };
  }

  // this method is called when the user requests a password reset when he forgot his password and is not logged in
  async resetPassword(resetDto: ResetLocalPassDto) {
    const { token, password } = resetDto;
    const tokenDB = await this.tokensRepository.findOneBy({ token });

    if (!tokenDB) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    if (tokenDB.used) {
      throw new HttpException(
        'Token already used or you requested a new one after this',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (tokenDB.expires < new Date(Date.now())) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }

    const user = await this.localUserRepository.findOneBy({
      email: tokenDB.email,
    });

    user.password = await hashPassword(password);
    await this.localUserRepository.save(user);

    tokenDB.used = true;
    await this.tokensRepository.save(tokenDB);
    return { message: 'Password changed successfully' };
  }
}

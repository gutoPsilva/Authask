import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { Profile } from 'src/entities/Profile.entity';
import { TasksService } from 'src/tasks/services/tasks/tasks.service';
import { UsersService } from 'src/users/services/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly userService: UsersService,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async findProfile(user: LocalUser | DiscordUser) {
    const userKey = user instanceof LocalUser ? 'localUser' : 'discordUser';
    return await this.profileRepository.findOneBy({
      [userKey]: user,
    });
  }

  async getProfileInfo(user: LocalUser | DiscordUser) {
    const stats = await this.tasksService.getStats(user);
    const userInfo =
      user instanceof DiscordUser
        ? await this.userService.findDiscordUser({ id: user.id })
        : await this.userService.findLocalUser({ id: user.id });

    const profile = await this.findProfile(user);

    // if there is a profile, get the profile picture url, else, return undefined
    const pfp = profile
      ? `http://localhost:${process.env.PORT || 3000}/uploads/${
          profile.filename
        }`
      : undefined;

    return {
      profile: {
        ...userInfo,
        pfp,
        password: undefined,
        id: undefined,
      },
      stats,
    };
  }

  async changeProfilePicture(
    file: Express.Multer.File,
    user: LocalUser | DiscordUser,
  ) {
    const unlinkAsync = util.promisify(fs.unlink);

    const profile = await this.findProfile(user);

    if (!profile) {
      const newPfp = this.profileRepository.create({
        filename: file.filename,
        localUser: user instanceof LocalUser ? user : undefined,
        discordUser: user instanceof DiscordUser ? user : undefined,
      });

      await this.profileRepository.save(newPfp);
      return {
        message: 'Profile picture uploaded successfully',
        uploaded: true,
      };
    } else {
      console.log('last upload: ' + profile.filename);
      const oldFilePath = path.join('./uploads', profile.filename);

      try {
        await unlinkAsync(oldFilePath);
      } catch (err) {
        console.log(err);
      }

      console.log(file.filename); // the new file name
      profile.filename = file.filename;
      await this.profileRepository.save(profile);
      return {
        message: 'Profile picture updated successfully',
        uploaded: true,
      };
    }
  }

  async deleteProfilePicture(user: LocalUser | DiscordUser) {
    const unlinkAsync = util.promisify(fs.unlink);
    const profile = await this.findProfile(user);

    if (profile) {
      const oldFilePath = path.join('./uploads', profile.filename);
      await unlinkAsync(oldFilePath);
      await this.profileRepository.remove(profile);

      return {
        message: 'Profile picture deleted successfully',
        deleted: true,
      };
    } else {
      throw new HttpException('User has no profile picture', 404);
    }
  }
}

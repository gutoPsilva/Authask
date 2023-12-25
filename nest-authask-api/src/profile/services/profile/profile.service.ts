import { Injectable } from '@nestjs/common';
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

  async getProfile(user: LocalUser | DiscordUser) {
    const stats = await this.tasksService.getStats(user);
    const profile =
      user instanceof DiscordUser
        ? await this.userService.findDiscordUser({ id: user.id })
        : await this.userService.findLocalUser({ id: user.id });
    return {
      profile: {
        ...profile,
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

    if (user instanceof LocalUser) {
      console.log(file.filename);
      const userHasPfp = await this.profileRepository.findOne({
        where: {
          localUser: user,
        },
      });

      if (!userHasPfp) {
        const newPfp = this.profileRepository.create({
          filename: file.filename,
          localUser: user,
        });

        return await this.profileRepository.save(newPfp);
      } else {
        console.log('last upload: ' + userHasPfp.filename);
        const oldFilePath = path.join('./uploads', userHasPfp.filename);
        console.log(oldFilePath);
        try {
          await unlinkAsync(oldFilePath);
        } catch (err) {
          console.log(err);
        }

        userHasPfp.filename = file.filename;
        return await this.profileRepository.save(userHasPfp);
      }
    }
  }
}

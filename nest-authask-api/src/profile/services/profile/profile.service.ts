import { Injectable } from '@nestjs/common';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { TasksService } from 'src/tasks/services/tasks/tasks.service';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly userService: UsersService,
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

  async saveProfilePicture(file: Express.Multer.File) {
    console.log(file);
  }
}

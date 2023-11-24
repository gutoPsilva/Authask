import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { Task } from 'src/entities/Task.entity';
import { validateDate } from 'src/utils/dateManipulators';
import {
  ICreateTaskDetails,
  ITaskInfo,
  IUpdateTaskDetails,
} from 'src/utils/interfaces e types/task.interface';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  // I need to check if the task belongs to the user, because since any authenticated user can acess the update/delete endpoints, a discord user could pass an id of a Task that belongs to another user to update or delete it.
  async checkUserPermission(user: LocalUser | DiscordUser, task: Task) {
    if (
      (user instanceof LocalUser && task.localUser.id !== user.id) ||
      (user instanceof DiscordUser && task.discordUser.id !== user.id)
    ) {
      throw new HttpException(
        "The task you're trying to manipulate doesn't belong to the authenticated user.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async allUserTasks(user: LocalUser | DiscordUser): Promise<Task[]> {
    const tasksList =
      user instanceof LocalUser
        ? await this.taskRepository.find({
            where: { localUser: { id: user.id } }, // searches for the foreign key localUser.id
          })
        : await this.taskRepository.find({
            where: { discordUser: { id: user.id } }, // searches for the foreign key discordUser.id
          });
    return tasksList;
  }

  async createTask(
    createTaskDetails: ICreateTaskDetails,
    user: LocalUser | DiscordUser, // when creating i need the user info to set the foreign key, so i need to know if it is a LocalUser or a DiscordUser
  ): Promise<ITaskInfo> {
    if (!createTaskDetails.startsAt) createTaskDetails.startsAt = new Date(); // startsAt isn't provided, it will be generated automatically and can be changed after

    if (!createTaskDetails.endsAt) {
      // endsAt isn't provided, it will be generated automatically and can be changed after
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + 1);
      createTaskDetails.endsAt = endsAt;
    }

    createTaskDetails.startsAt = validateDate(
      createTaskDetails.startsAt.toString(),
    );
    createTaskDetails.endsAt = validateDate(
      createTaskDetails.endsAt.toString(),
    );

    if (createTaskDetails.endsAt < createTaskDetails.startsAt)
      throw new HttpException(
        'End date must be after start date.',
        HttpStatus.BAD_REQUEST,
      );

    const newTask = this.taskRepository.create({
      ...createTaskDetails,
      localUser: user instanceof LocalUser ? user : null, // set the foreign keys
      discordUser: user instanceof DiscordUser ? user : null, // set the foreign keys
    });

    const savedTask = await this.taskRepository.save(newTask);

    // i decided to disable the eslint rule below because i want to return only the task info, and not the users info, so TS won't complain about not using the variables discordUser and localUser

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { discordUser, localUser, ...taskInfo } = savedTask;

    return taskInfo;
  }

  async updateTask(
    id: number,
    updateTaskDetails: IUpdateTaskDetails,
    user: LocalUser | DiscordUser, // need this to check if tasks really belongs to the user
  ): Promise<ITaskInfo> {
    try {
      const taskToUpdate = await this.taskRepository.findOne({
        where: { id },
        relations: ['localUser', 'discordUser'],
      });

      if (!taskToUpdate)
        throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);

      await this.checkUserPermission(user, taskToUpdate);

      updateTaskDetails.endsAt = validateDate(
        updateTaskDetails.endsAt.toString(),
      );

      updateTaskDetails.startsAt = validateDate(
        updateTaskDetails.startsAt.toString(),
      );

      if (
        updateTaskDetails.endsAt &&
        updateTaskDetails.startsAt &&
        updateTaskDetails.endsAt < updateTaskDetails.startsAt
      )
        throw new HttpException(
          'End date must be after start date.',
          HttpStatus.BAD_REQUEST,
        );

      const updatedTask = this.taskRepository.merge(
        taskToUpdate,
        updateTaskDetails,
      );

      const savedTask = await this.taskRepository.save(updatedTask);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { discordUser, localUser, ...taskInfo } = savedTask;

      return taskInfo;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async deleteTask(
    id: number,
    user: LocalUser | DiscordUser,
  ): Promise<boolean> {
    try {
      const taskToDelete = await this.taskRepository.findOne({
        where: { id },
        relations: ['localUser', 'discordUser'],
      });

      if (!taskToDelete) return false;

      await this.checkUserPermission(user, taskToDelete);
      await this.taskRepository.delete(id);

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

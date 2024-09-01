import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateTaskDto } from '../../dtos/CreateTaskDTO';
import { UpdateTaskDto } from '../../dtos/UpdateTaskDto';
import { LocalUser } from '../../../entities/LocalUser.entity';
import { DiscordUser } from '../../../entities/DiscordUser.entity';
import { AuthenticatedGuard } from '../../../auth/utils/Guards/AuthGuards';
import { TasksService } from '../../services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getUserTasks(@Req() req: Request) {
    console.log(req.user);
    return await this.tasksService.allUserTasks(
      req.user as LocalUser | DiscordUser,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createTask(@Req() req: Request, @Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(
      createTaskDto,
      req.user as LocalUser | DiscordUser,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(
      id,
      updateTaskDto,
      req.user as LocalUser | DiscordUser,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.tasksService.deleteTask(
      id,
      req.user as LocalUser | DiscordUser,
    );
  }

  // @UseGuards(AuthenticatedGuard)
  // @Get('/stats')
  // async getStats(@Req() req: Request) {
  //   return await this.tasksService.getStats(
  //     req.user as LocalUser | DiscordUser,
  //   );
  // }
}

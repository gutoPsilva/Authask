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
import { AuthenticatedGuard } from 'src/auth/utils/Guards/UnifiedGuards';
import { TasksService } from 'src/tasks/services/tasks/tasks.service';
import { Request } from 'express';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { CreateTaskDto } from 'src/tasks/dtos/CreateTaskDto';
import { UpdateTaskDto } from 'src/tasks/dtos/UpdateTaskDto';

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
}

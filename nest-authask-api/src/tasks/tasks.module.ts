import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks/tasks.controller';
import { TasksService } from './services/tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/Task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}

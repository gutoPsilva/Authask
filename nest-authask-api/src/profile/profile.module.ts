import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TasksModule, UsersModule],
})
export class ProfileModule {}

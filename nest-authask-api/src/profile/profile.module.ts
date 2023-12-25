import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/Profile.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TasksModule, UsersModule, TypeOrmModule.forFeature([Profile])],
})
export class ProfileModule {}

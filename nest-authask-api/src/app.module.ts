import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from './entities/LocalUser.entity';
import { DiscordUser } from './entities/DiscordUser.entity';
import { Task } from './entities/Task.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Session } from './entities/Session.entity';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [LocalUser, DiscordUser, Task, Session],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PassportModule.register({ session: true }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
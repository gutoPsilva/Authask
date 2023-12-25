import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from './entities/LocalUser.entity';
import { DiscordUser } from './entities/DiscordUser.entity';
import { Task } from './entities/Task.entity';
import { PassTokens } from './entities/PassTokens.entity';
import { Session } from './entities/Session.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { TasksModule } from './tasks/tasks.module';
import { EmailModule } from './email/email.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './entities/Profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [LocalUser, DiscordUser, Task, Session, PassTokens, Profile],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    PassportModule.register({ session: true }),
    EmailModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

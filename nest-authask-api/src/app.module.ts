import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from './entities/LocalUser.entity';
import { DiscordUser } from './entities/DiscordUser.entity';
import { Task } from './entities/Task.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Session } from './entities/Session.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'authask',
      entities: [LocalUser, DiscordUser, Task, Session],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

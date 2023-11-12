import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { DiscordUser } from 'src/entities/DiscordUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalUser, DiscordUser])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [],
})
export class UsersModule {}

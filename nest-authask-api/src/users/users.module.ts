import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { PassTokens } from 'src/entities/PassTokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalUser, DiscordUser, PassTokens])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email/email.controller';
import { EmailService } from './services/email/email.service';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { UsersModule } from 'src/users/users.module';
import { PassTokens } from 'src/entities/PassTokens.entity';

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([LocalUser, DiscordUser, PassTokens]),
    UsersModule,
  ],
})
export class EmailModule {}

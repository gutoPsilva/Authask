import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { LocalStrategy } from './utils/LocalStrategy';
import { AuthController } from './controllers/auth/auth.controller';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './utils/SessionSerializer';

@Module({
  imports: [TypeOrmModule.forFeature([LocalUser, DiscordUser]), UsersModule], // importar as duas tabelas para fazer as ações de AUTENTICAÇÃo no banco de dados
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UsersService,
    },
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}

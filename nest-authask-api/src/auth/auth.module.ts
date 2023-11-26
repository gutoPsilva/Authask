import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { AuthController } from './controllers/auth/auth.controller';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { UsersModule } from 'src/users/users.module';
import { SessionSerializer } from './utils/SessionSerializer';
import { LocalStrategy } from './utils/Strategy/LocalStrategy';
import { DiscordStrategy } from './utils/Strategy/DiscordStrategy';
import { PassTokens } from 'src/entities/PassTokens.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalUser, DiscordUser, PassTokens]),
    UsersModule,
  ], // importar as duas tabelas para fazer as ações de AUTENTICAÇÃo no banco de dados
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
    DiscordStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}

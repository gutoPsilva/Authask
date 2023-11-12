import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from './entities/Session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = app.get(DataSource).getRepository(Session);

  // the DTO class-validators decorators weren't working without this piece of code. dunno why
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
    }),
  );

  app.use(
    session({
      secret: 'megaUltraAmazingPlusExtraIncredibleSecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
      store: new TypeormStore({
        cleanupLimit: 10,
      }).connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();

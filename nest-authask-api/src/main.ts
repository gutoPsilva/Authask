import { config } from 'dotenv';
config(); // MUST load environment variables from .env file BEFORE using them to connect to DB

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from './entities/Session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const sessionRepository = app.get(DataSource).getRepository(Session);

  // the DTO class-validators decorators weren't working without this piece of code. dunno why
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 4, // a logged session will last 4 hours
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

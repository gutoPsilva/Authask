import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Req,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { RegisterLocalUserDto } from 'src/auth/dtos/registerLocalUser.dto';
import { UnifiedAuthGuard } from 'src/auth/utils/Guards/UnifiedGuards';
import { UsersService } from 'src/users/services/users/users.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(UnifiedAuthGuard)
  @Post('login')
  async loginLocal(@Req() req: Request) {
    return req.user;
  }

  @Post('signup')
  async signup(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    const { ...userDetails } = registerLocalUserDto;
    const createdUser = await this.userService.registerLocalUser(userDetails);
    return createdUser;
  }

  @UseGuards(UnifiedAuthGuard)
  @Get('discord')
  async signinDiscord() {}

  @UseGuards(UnifiedAuthGuard)
  @Get('discord/redirect')
  async discordRedirect(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      req.logout((err) => {
        if (err) {
          console.log(err);
          new HttpException(
            'Error logging out',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
      return res.status(HttpStatus.OK).send('Logged out');
    }
    return res.status(HttpStatus.NOT_FOUND).send('No user to log out');
  }
}

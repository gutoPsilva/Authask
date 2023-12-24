import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Req,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RegisterLocalUserDto } from 'src/auth/dtos/registerLocalUser.dto';
import {
  AuthenticatedGuard,
  DiscordAuthGuard,
  LocalAuthGuard,
} from 'src/auth/utils/Guards/AuthGuards';
import { UsersService } from 'src/users/services/users/users.service';
import { Request } from 'express';
import { ResetLocalPass } from 'src/auth/dtos/ResetLocalPass.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginLocal(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Post('signup')
  async signup(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    const { ...userDetails } = registerLocalUserDto;
    const createdUser = await this.userService.registerLocalUser(userDetails);
    return createdUser;
  }

  @UseGuards(DiscordAuthGuard)
  @Get('discord')
  async signinDiscord() {}

  @UseGuards(DiscordAuthGuard)
  @Get('discord/redirect')
  async discordRedirect(@Req() req: Request) {
    // authorized
    return `
    <script>
      window.opener.postMessage(${JSON.stringify(req.user)}, 
      "${process.env.CLIENT_ORIGIN_URL}/login");
      window.close();
    </script>`;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Req() req: Request) {
    console.log('Logging out');
    try {
      req.logOut((err) => {
        if (err) throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return { message: 'Logged out successfully', loggedOut: true };
    } catch (err) {
      console.log(err);
      return {
        message: 'Failed to logout',
        loggedOut: false,
      };
    }
  }

  @Post('reset-password')
  resetPass(@Body() resetLocalPassDto: ResetLocalPass) {
    return this.userService.resetPassword(resetLocalPassDto);
  }
}

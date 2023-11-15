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
import { UnifiedAuthGuard } from 'src/auth/utils/Guards/UnifiedGuards';
import { UsersService } from 'src/users/services/users/users.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(UnifiedAuthGuard)
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

  @UseGuards(UnifiedAuthGuard)
  @Get('discord')
  async signinDiscord() {}

  @UseGuards(UnifiedAuthGuard)
  @Get('discord/redirect')
  async discordRedirect(@Req() req: Request) {
    // authorized
    return `<script>
    window.opener.postMessage(${JSON.stringify(
      req.user,
    )}, "http://localhost:4200/login");
    window.close();
  </script>`;
  }

  @Delete('logout')
  logout(@Req() req: Request) {
    console.log('Logging out');
    try {
      req.logOut((err) => {
        if (err) throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
      req.session.cookie.maxAge = 0; // destroy session
      return { message: 'Logged out successfully', loggedOut: true };
    } catch (err) {
      console.log(err);
      return {
        message: 'Failed to logout',
        loggedOut: false,
      };
    }
  }
}

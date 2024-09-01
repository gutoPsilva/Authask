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
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  AuthenticatedGuard,
  DiscordAuthGuard,
  LocalAuthGuard,
} from 'src/auth/utils/Guards/AuthGuards';
import { UsersService } from 'src/users/services/users/users.service';
import { Request } from 'express';
import { ResetLocalPassDto } from 'src/auth/dtos/ResetLocalPass.dto';
import { UpdateLocalPassDto } from 'src/auth/dtos/UpdateLocalPass.dto';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { RegisterLocalUserDto } from '../../dtos/RegisterLocalUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async loginLocal(@Req() req: Request) {
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

  @UseGuards(AuthenticatedGuard)
  @Patch('update-password')
  updatePass(
    @Body() updateLocalPassDto: UpdateLocalPassDto,
    @Req() req: Request,
  ) {
    return this.userService.updatePassword(
      updateLocalPassDto,
      req.user as LocalUser,
    );
  }

  @Patch('reset-password')
  resetPass(@Body() resetLocalPassDto: ResetLocalPassDto) {
    return this.userService.resetPassword(resetLocalPassDto);
  }
}

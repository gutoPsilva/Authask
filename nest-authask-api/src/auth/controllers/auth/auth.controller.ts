import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
// import { Request as ExpressReq } from 'express';
import { RegisterLocalUserDto } from 'src/auth/dtos/registerLocalUser.dto';
import { AuthenticatedGuard, LocalAuthGuard } from 'src/auth/utils/LocalGuard';
import { UsersService } from 'src/users/services/users/users.service';
@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    return 'Logged in';
  }

  @Post('signup')
  async signup(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    const { ...userDetails } = registerLocalUserDto;
    const createdUser = await this.userService.registerLocalUser(userDetails);
    return createdUser;
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  isLogged() {
    return 'You are logged in';
  }
}

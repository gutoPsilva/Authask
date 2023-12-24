import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/utils/Guards/AuthGuards';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { ProfileService } from 'src/profile/services/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getProfile(@Req() req: Request) {
    return await this.profileService.getProfile(
      req.user as LocalUser | DiscordUser,
    );
  }
}

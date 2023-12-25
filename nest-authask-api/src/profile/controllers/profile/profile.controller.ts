import {
  Controller,
  Get,
  Req,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/utils/Guards/AuthGuards';
import { DiscordUser } from 'src/entities/DiscordUser.entity';
import { LocalUser } from 'src/entities/LocalUser.entity';
import { FileValidationPipe } from 'src/pipes/file-validation/file-validation.pipe';
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

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor('pfp', {
      dest: './uploads',
    }),
  )
  @Post('upload')
  async uploadFile(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    await this.profileService.saveProfilePicture(file);
    return file;
  }
}

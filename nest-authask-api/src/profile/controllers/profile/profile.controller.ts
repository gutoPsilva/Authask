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
import * as multer from 'multer';
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
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9); // é para gerar um nome único para o arquivo, se de algum modo dois arquivos tiverem o mesmo nome essa pessoa tem q jogar na mega-sena pô, a chance disso acontecer é de 1 em 1 QUADRILHÃO
          const extension = file.mimetype.split('/')[1]; // Extract the extension from the mimetype, after image/
          cb(null, `${uniqueSuffix}.${extension}`);
        },
      }),
    }),
  )
  @Post('upload')
  async uploadFile(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Req() req: Request,
  ) {
    await this.profileService.changeProfilePicture(
      file,
      req.user as LocalUser | DiscordUser,
    );
    return file;
  }
}

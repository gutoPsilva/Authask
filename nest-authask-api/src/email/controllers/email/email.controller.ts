import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from 'src/email/services/email/email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send-token')
  async sendToken(@Body() body: { email: string }) {
    console.log(body.email);
    return await this.emailService.sendResetToken(body.email);
  }
}

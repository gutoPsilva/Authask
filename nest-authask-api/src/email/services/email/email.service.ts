import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { PassTokens } from 'src/entities/PassTokens.entity';
import { UsersService } from 'src/users/services/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject('USER_SERVICE') private readonly userService: UsersService,
    @InjectRepository(PassTokens)
    private tokensRepository: Repository<PassTokens>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, token: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'AUTHASK - Password reset token',
      text: `Here is your generated token to reset the password: ${token}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetToken(email: string) {
    const userDB = await this.userService.findLocalUser({ email });

    if (!userDB) {
      // it'll throw a new error anyway, but it's better to be explicit
      return;
    }

    let token: string;
    while (true) {
      // keep generating a new token until it is unique
      token = randomBytes(16).toString('hex');
      const tokenInUse = await this.tokensRepository.findOne({
        where: { token },
      });

      if (!tokenInUse) break;
    }

    const emailHasToken = await this.tokensRepository.find({
      where: { email },
    });

    emailHasToken.map((token) => {
      token.used = true;
    });

    await this.tokensRepository.save(emailHasToken);

    const newToken = this.tokensRepository.create({
      token,
      email,
      used: false,
      expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });

    await this.tokensRepository.save(newToken);
    await this.sendEmail(email, token);

    return { message: `Token sent to email: ${email}` };
  }
}

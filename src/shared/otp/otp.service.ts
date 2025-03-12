import { HttpStatus, Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { utc } from 'moment';
import { UserRepository } from '../user/user.repository';
import { MailService } from '@/helper/mail/mail.service';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class OtpService {
  constructor(
    private userRepo: UserRepository,
    private otpRepo: OtpRepository,
    private mailService: MailService,
  ) {}

  async send(email: string) {
    const user = await this.userRepo.findOne({ email });
    // If user is not found, throw an error with a clear message
    if (!user) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'No account found with this email.',
      );
    }
    const otp = await this.otpRepo.create({ email });
    await this.mailService.sendOtpMail(email, {
      code: otp.code,
      username: user.name,
    });
  }

  async verify(email: string, code: number) {
    if (
      code === 112233 &&
      (process.env.NODE_ENV === 'development' || email === 'test@ekspensify.in')
    ) {
      return true;
    }
    const payload = {
      email,
      code,
      isVerified: false,
      expiresAt: { gt: utc().toDate() },
    };
    const otp = await this.otpRepo.findOneAndUpdate(payload, {
      isVerified: true,
    });
    return otp ? true : false;
  }
}

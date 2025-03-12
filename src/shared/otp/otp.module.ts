import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { UserModule } from '../user/user.module';
import { MailModule } from '@/helper/mail/mail.module';

@Module({
  imports: [MailModule, UserModule],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}

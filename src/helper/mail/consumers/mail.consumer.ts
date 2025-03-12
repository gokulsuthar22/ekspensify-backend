import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MAIL_QUEUE } from '../mail.constants';

@Processor(MAIL_QUEUE)
export class MailConsumer {
  constructor(private mailerServie: MailerService) {}

  @Process()
  async send(job: any) {
    try {
      await this.mailerServie.sendMail(job.data);
    } catch (error) {
      console.error('Error while sending mail', error);
    }
  }
}

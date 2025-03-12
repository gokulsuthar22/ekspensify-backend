import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MAIL_QUEUE } from '../mail.constants';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue(MAIL_QUEUE) private mailQueue: Queue) {}

  async add(data: ISendMailOptions) {
    await this.mailQueue.add(data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }
}

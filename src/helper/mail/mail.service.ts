import { Injectable } from '@nestjs/common';
import { MailTemplateFactory } from './mail-template.factory';
import { MailProducer } from './producers/mail.producer';
import { OtpMailPaylaod, StatementMailPaylaod } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    private mailProducer: MailProducer,
    private mailTemplateFactory: MailTemplateFactory,
  ) {}

  async sendOtpMail(email: string, payload: OtpMailPaylaod) {
    const data = this.mailTemplateFactory.otpMail(email, payload);
    await this.mailProducer.add(data);
  }

  async sendStatementMail(email: string, payload: StatementMailPaylaod) {
    const data = this.mailTemplateFactory.statementMail(email, payload);
    await this.mailProducer.add(data);
  }
}

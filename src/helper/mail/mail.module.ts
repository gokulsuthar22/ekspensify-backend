import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from './mail.constants';
import { MailProducer } from './producers/mail.producer';
import { MailConsumer } from './consumers/mail.consumer';
import { MailTemplateFactory } from './mail-template.factory';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail').host,
          port: configService.get('mail').port,
          secure: true,
          auth: {
            user: configService.get('mail').user,
            pass: configService.get('mail').password,
          },
        },
        defaults: {
          from: `"Ekspensify" <${configService.get('mail').user}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/helper/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('redis').url,
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailTemplateFactory, MailService, MailProducer, MailConsumer],
  exports: [MailService],
})
export class MailModule {}

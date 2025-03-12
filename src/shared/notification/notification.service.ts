import { Injectable } from '@nestjs/common';
import { SendNotificationData } from './notification.interface';
import {
  NotificationByDeviceBuilder,
  OneSignalAppClient,
} from 'onesignal-api-client-core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private client: OneSignalAppClient;

  constructor(private configService: ConfigService) {
    this.client = new OneSignalAppClient(
      this.configService.get('oneSignal').appId,
      this.configService.get('oneSignal').apiKey,
    );
  }

  async notifyUser(data: SendNotificationData) {
    const oneSignalPayload = new NotificationByDeviceBuilder()
      .setIncludeExternalUserIds(data.userId.map((i) => i.toString()))
      .notification()
      .setAppearance({
        small_icon: 'ic_stat_notification',
      })
      .setContents({ en: data?.content })
      .setHeadings({ en: data.heading })
      .setAttachments({
        big_picture: data?.imageUrl,
        data: data.data,
      })
      .build();
    await this.client.createNotification(oneSignalPayload);
  }
}

import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UserModule } from '@/shared/user/user.module';
import { NotificationModule } from '@/shared/notification/notification.module';

@Module({
  imports: [UserModule, NotificationModule],
  controllers: [MeController],
})
export class MeModule {}

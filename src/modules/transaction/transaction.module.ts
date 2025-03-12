import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { MediaModule } from '@/helper/media/media.module';
import { UserModule } from '@/shared/user/user.module';
import { AccountModule } from '../account/account.module';
import { BudgetModule } from '../budget/budget.module';
import { MailModule } from '@/helper/mail/mail.module';
import { NotificationModule } from '@/shared/notification/notification.module';

@Module({
  imports: [
    MailModule,
    NotificationModule,
    AccountModule,
    UserModule,
    MediaModule,
    BudgetModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}

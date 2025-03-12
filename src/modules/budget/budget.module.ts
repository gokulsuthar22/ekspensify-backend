import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetRepository } from './budget.repository';
import { BudgetController } from './budget.controller';
import { UserModule } from '@/shared/user/user.module';
import { BudgetReportRepository } from './repositories/budget-report.repository';
import { BudgetTransactionRepository } from './repositories/budget-transaction.repository';

@Module({
  imports: [UserModule],
  controllers: [BudgetController],
  providers: [
    BudgetService,
    BudgetRepository,
    BudgetReportRepository,
    BudgetTransactionRepository,
  ],
  exports: [
    BudgetRepository,
    BudgetReportRepository,
    BudgetTransactionRepository,
  ],
})
export class BudgetModule {}

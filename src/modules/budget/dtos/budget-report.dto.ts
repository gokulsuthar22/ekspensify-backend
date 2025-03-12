import { Expose, Type } from 'class-transformer';

export class BudgetReportDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => Number)
  amount: number;

  @Expose({ name: 'totalTransactions' })
  @Type(() => Number)
  total_transactions: number;

  @Expose({ name: 'periodNo' })
  period_no: number;

  @Expose({ name: 'periodStartDate' })
  period_start_date: string;

  @Expose({ name: 'periodEndDate' })
  period_end_date: string;
}

import { Transaction } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginatedResultDto } from '@/common/dtos/paginated-result.dto';
import { BudgetTransactionDto } from './budget-transaction.dto';

export class BudgetTransactionPaginatedResponseDto extends PaginatedResultDto<Transaction> {
  @Type(() => BudgetTransactionDto)
  items: BudgetTransactionDto[];
}

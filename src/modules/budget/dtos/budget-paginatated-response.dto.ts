import { Budget } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginatedResultDto } from '@/common/dtos/paginated-result.dto';
import { BudgetDto } from './budget.dto';
import { BudgetListMeta } from '../budget.interface';

export class BudgetPaginatedResponseDto extends PaginatedResultDto<
  Budget,
  BudgetListMeta
> {
  @Type(() => BudgetDto)
  items: BudgetDto[];
}

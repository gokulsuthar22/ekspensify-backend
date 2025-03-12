import { BudgetPeriod } from '@prisma/client';
import { Type } from 'class-transformer';
import { PaginatedResultDto } from '@/common/dtos/paginated-result.dto';
import { BudgetReportDto } from './budget-report.dto';

export class BudgetReportPaginatedResponseDto extends PaginatedResultDto<BudgetPeriod> {
  @Type(() => BudgetReportDto)
  items: BudgetReportDto[];
}

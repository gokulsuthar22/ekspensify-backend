import { User } from '@prisma/client';
import { TransactionDto } from './transaction.dto';
import { Type } from 'class-transformer';
import { PaginatedResultDto } from '@/common/dtos/paginated-result.dto';

export class TransactionPaginatedResponseDto extends PaginatedResultDto<User> {
  @Type(() => TransactionDto)
  items: TransactionDto[];
}

import { Expose } from 'class-transformer';

export class AccountSummeryResponseDto {
  @Expose()
  total: string;

  @Expose()
  credit: string;

  @Expose()
  debit: string;
}

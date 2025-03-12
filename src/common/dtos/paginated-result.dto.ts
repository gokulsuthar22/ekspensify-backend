import { Expose } from 'class-transformer';
import { PaginatedResult } from '../types/pagination.interface';

export class PaginatedResultDto<T, U = any> implements PaginatedResult<T, U> {
  @Expose()
  limit: number;

  @Expose()
  next: number;

  @Expose()
  offset: number;

  @Expose()
  prev: number;

  @Expose()
  total: number;

  @Expose()
  items: any;

  @Expose()
  meta?: U;
}

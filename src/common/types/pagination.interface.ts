export type PaginatedResult<T, U = any> = {
  limit: number;
  next: number;
  offset: number;
  prev: number;
  total: number;
  meta?: U;
  items: T[];
};

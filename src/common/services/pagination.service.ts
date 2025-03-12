import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../types/pagination.type';
import { PaginatedResult } from '../types/pagination.interface';

interface PaginatePayload extends PaginationParams {
  select?: any;
  orderBy?: any;
  where?: any;
  include?: any;
}

@Injectable()
export class PaginationService {
  /**
   * Paginates the data for the given Prisma model.
   * @param payload - The pagination parameters including page, limit, and any filters (where conditions).
   * @param model - The actuall Prisma model (e.g., prisma.user) for which to paginate data.
   * @returns A paginated result containing items, pagination details, and total count.
   */
  async paginate<T, U = any>(
    model: any,
    payload: PaginatePayload,
    meta?: U,
  ): Promise<PaginatedResult<T, U>> {
    const { select, orderBy, where, include } = payload;

    // Parse's into int
    const page = +where.page || 1;
    let limit = +where.limit || 10;

    delete where.page;
    delete where.limit;

    // Cap the limit to 100 to prevent large data loads
    if (limit > 100) limit = 100;

    // Calculate offset (i.e., how many records to skip)
    const offset = (page - 1) * limit;

    // Fetch items and total count concurrently
    const [items, total] = await Promise.all([
      model.findMany({
        skip: offset,
        take: limit,
        where,
        include,
        select,
        orderBy,
      }),
      model.count({ where }),
    ]);

    // Calculate next and previous page numbers
    const next = page * limit < total ? page + 1 : null;
    const prev = page > 1 ? page - 1 : null;

    // Return paginated result with metadata and items
    return { limit, next, offset, prev, meta, total, items };
  }
}

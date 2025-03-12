import { PaginationService } from '@/common/services/pagination.service';
import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BudgetTransaction } from '@prisma/client';

@Injectable()
export class BudgetTransactionRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

  private get BudgetTransaction() {
    return this.prismaService.budgetTransaction;
  }

  private txSelect = {
    id: true,
    slug: true,
    accountId: true,
    amount: true,
    note: true,
    type: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    account: {
      select: {
        id: true,
        name: true,
        icon: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
        icon: {
          select: {
            path: true,
          },
        },
        icFillColor: true,
      },
    },
    attachment: {
      select: {
        path: true,
      },
    },
  };

  async create(data: any) {
    const budgetTx = await this.BudgetTransaction.create({ data });
    return budgetTx;
  }

  async findMany(where?: any) {
    const budgetTxs = await this.paginationService.paginate<BudgetTransaction>(
      this.BudgetTransaction,
      {
        where,
        select: { transaction: { select: this.txSelect } },
        orderBy: { createdAt: 'desc' },
      },
    );
    return budgetTxs;
  }

  async findManyAndDelete(where: any) {
    const budgetTxs = await this.BudgetTransaction.findMany({ where });

    await this.BudgetTransaction.deleteMany({ where });

    return budgetTxs;
  }

  async calTotalReportTx(reportId: number) {
    const { _count } = await this.BudgetTransaction.aggregate({
      _count: true,
      where: {
        reportId,
      },
    });
    return +_count || 0;
  }

  async calTotalPeriodAmount(reportId: number) {
    const { _sum } = await this.BudgetTransaction.aggregate({
      _sum: { amount: true },
      where: {
        reportId,
      },
    });
    return +_sum.amount || 0;
  }
}

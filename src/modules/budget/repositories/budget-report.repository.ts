import { PaginationService } from '@/common/services/pagination.service';
import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { BudgetReport } from '@prisma/client';
import * as moment from 'moment';
import { CreateBudgetReportData } from '../budget.interface';

@Injectable()
export class BudgetReportRepository {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
  ) {}

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

  private get BudgetReport() {
    return this.prismaService.budgetReport;
  }

  async create(data: CreateBudgetReportData) {
    const currentDate = moment().utc();

    let periodUnit = data.budgetPeriod.toLowerCase().replace('ly', '');

    if (periodUnit === 'dai') {
      periodUnit = 'day';
    }

    const periodStartDate = currentDate.clone().toDate();
    let periodEndDate = currentDate
      .endOf(periodUnit as moment.unitOfTime.DurationConstructor)
      .subtract(5, 'hours')
      .subtract(30, 'minutes')
      .toDate();

    if (periodUnit === 'day') {
      periodEndDate = periodStartDate;
    }

    const report = await this.BudgetReport.create({
      data: {
        budgetId: data.budgetId,
        periodStartDate,
        periodEndDate,
        periodNo: data.budgetPeriodNo,
      },
    });

    return report;
  }

  async update(id: number, data?: any) {
    const report = await this.BudgetReport.update({ where: { id }, data });
    return report;
  }

  async findMany(where?: any) {
    const reports = await this.paginationService.paginate<BudgetReport>(
      this.BudgetReport,
      {
        where,
        orderBy: { createdAt: 'desc' },
      },
    );
    return reports;
  }

  async calTotalReportAmount(budgetId: number) {
    const { _sum } = await this.BudgetReport.aggregate({
      _sum: { amount: true },
      where: {
        budgetId,
      },
    });
    return +_sum.amount || 0;
  }
}

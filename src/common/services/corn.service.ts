import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class CronService {
  constructor(private prismaService: PrismaService) {}

  private readonly logger = new Logger(CronService.name);

  @Cron('0 0 0 * * *')
  async processBudgets() {
    this.logger.debug(
      `Daily budget processing started at ${new Date().toISOString()}`,
    );

    const currentDate = moment();

    const isWeekend = currentDate.weekday() === 0;

    const isMonthStart = currentDate.isSame(
      currentDate.clone().startOf('month'),
      'day',
    );

    const isQuarterStart = currentDate.isSame(
      currentDate.clone().startOf('quarter'),
      'day',
    );

    const isYearStart = currentDate.isSame(
      currentDate.clone().startOf('year'),
      'day',
    );

    const recurringBudgets = await this.prismaService.budget.findMany({
      where: { type: 'RECURRING', status: 'RUNNING' },
    });

    await this.prismaService.budget.updateMany({
      where: {
        type: 'EXPIRING',
        status: 'RUNNING',
        endDate: { lte: currentDate.toDate() },
      },
      data: { status: 'CLOSED' },
    });

    this.logger.debug(`${recurringBudgets.length} recurring budgets found`);

    const budgetIdsToUpdate: number[] = [];

    // Identify budgets to update based on their recurrence period
    for (const budget of recurringBudgets) {
      const shouldUpdate = this.shouldUpdateBudget(
        budget.period,
        isWeekend,
        isMonthStart,
        isQuarterStart,
        isYearStart,
      );

      if (shouldUpdate) {
        budgetIdsToUpdate.push(budget.id);

        // Generate new budget reports and update budgets with the new reports
        const { periodStartDate, periodEndDate } = this.calculatePeriodDates(
          budget.period,
          currentDate,
        );

        const budgetReports = await this.prismaService.budgetReport.create({
          data: {
            budgetId: budget.id,
            amount: 0,
            periodNo: budget.periodNo + 1,
            periodStartDate,
            periodEndDate,
          },
        });

        // this.logger.debug(`${budgetReports.length} budget reports created`);

        await this.updateBudgetsWithReports(budgetReports);
      }
    }

    // Increment periodNo for applicable budgets
    if (budgetIdsToUpdate.length) {
      await this.prismaService.budget.updateMany({
        where: { id: { in: budgetIdsToUpdate } },
        data: { periodNo: { increment: 1 } },
      });

      this.logger.debug(`${budgetIdsToUpdate.length} budgets updated`);
    }

    this.logger.debug(
      `Daily budget processing finished at ${new Date().toISOString()}`,
    );
  }

  private shouldUpdateBudget(
    period: string,
    isWeekend: boolean,
    isMonthStart: boolean,
    isQuarterStart: boolean,
    isYearStart: boolean,
  ): boolean {
    switch (period) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return isWeekend;
      case 'MONTHLY':
        return isMonthStart;
      case 'QUARTERLY':
        return isQuarterStart;
      case 'YEARLY':
        return isYearStart;
      default:
        this.logger.error(`Unknown budget period: ${period}`);
        return false;
    }
  }

  private calculatePeriodDates(
    period: string,
    currentDate: moment.Moment,
  ): { periodStartDate: Date; periodEndDate: Date } {
    let periodUnit = period.toLowerCase().replace('ly', '');

    if (periodUnit === 'dai') {
      periodUnit = 'day';
    }

    const periodStartDate = currentDate.clone().toDate();

    let periodEndDate = currentDate
      .endOf(periodUnit as moment.unitOfTime.DurationConstructor)
      .utc()
      .toDate();

    if (periodUnit === 'day') {
      periodEndDate = periodStartDate;
    }

    return { periodStartDate, periodEndDate };
  }

  private async updateBudgetsWithReports(report: any) {
    await this.prismaService.budget.update({
      where: { id: report.budgetId },
      data: { reportId: report.id, spent: 0 },
    });
  }
}

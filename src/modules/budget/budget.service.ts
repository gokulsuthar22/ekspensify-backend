import { HttpStatus, Injectable } from '@nestjs/common';
import { BudgetRepository } from './budget.repository';
import {
  BudgetWhere,
  CreateBudgetData,
  FilterBudgetWhere,
  UpdateBudgetData,
} from './budget.interface';
import { BudgetReportRepository } from './repositories/budget-report.repository';
import { BudgetTransactionRepository } from './repositories/budget-transaction.repository';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class BudgetService {
  constructor(
    private budgetRepo: BudgetRepository,
    private budgetReportRepo: BudgetReportRepository,
    private budgetTransactionRepo: BudgetTransactionRepository,
  ) {}

  async create(data: Omit<CreateBudgetData, 'reportId'>) {
    let budget = await this.budgetRepo.create(data);

    const report = await this.budgetReportRepo.create({
      budgetId: budget.id,
      budgetPeriod: budget.period,
      budgetPeriodNo: budget.periodNo,
    });

    budget = await this.budgetRepo.updateById(budget.id, {
      reportId: report.id,
    });

    return budget;
  }

  async update(where: BudgetWhere, data?: UpdateBudgetData) {
    const budget = await this.budgetRepo.findOneAndUpdate(where, data);
    if (!budget) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Budget not found');
    }
    return budget;
  }

  async delete(where: BudgetWhere) {
    const budget = await this.budgetRepo.findOneAndDelete(where);
    if (!budget) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Budget not found');
    }
    return budget;
  }

  async findOne(where: BudgetWhere) {
    const budget: any = await this.budgetRepo.findOne(where);
    if (!budget) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Budget not found');
    }
    return budget;
  }

  async findMany(where?: FilterBudgetWhere) {
    const budgets = await this.budgetRepo.findMany(where);
    return budgets;
  }

  async findManyBudgetTransactions(where?: any) {
    const budgetTransactions = await this.budgetTransactionRepo.findMany(where);
    budgetTransactions.items = budgetTransactions.items.map(
      (t: any) => t.transaction,
    );
    return budgetTransactions;
  }

  async findManyBudgetReports(where?: any) {
    const budgetReports = await this.budgetReportRepo.findMany(where);
    return budgetReports;
  }
}

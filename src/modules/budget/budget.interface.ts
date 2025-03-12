import { BudgetPeriod, BudgetStatus, BudgetType } from '@prisma/client';

export interface CreateBudgetData {
  limit: number;
  userId: number;
  reportId?: number;
  period: BudgetPeriod;
  type: BudgetType;
  startDate: string;
  endDate?: string;
  budgetAccounts?: any[];
  budgetCategories?: any[];
}

export interface UpdateBudgetData {
  limit?: number;
  spent?: number;
  userId?: number;
  reportId?: number;
  accountId?: number;
  categoryId?: number;
  period?: BudgetPeriod;
  type?: BudgetType;
  status?: BudgetStatus;
  startDate?: string;
  endDate?: string;
  amount?: number;
}

export interface FilterBudgetWhere {
  userId?: number;
}

export interface BudgetWhere {
  id: number;
  userId?: number;
  status?: BudgetStatus;
}

export interface CreateBudgetCategoryData {
  budgetId: number;
  categoryId: number;
}

export interface CreateBudgetAccountData {
  budgetId: number;
  accountId: number;
}

export interface CreateBudgetReportData {
  budgetId: number;
  budgetPeriod: BudgetPeriod;
  budgetPeriodNo: number;
}

export interface BudgetListMeta {
  closed: number;
  running: number;
}

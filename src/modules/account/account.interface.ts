import { AcType } from '@prisma/client';

export interface GenerateAccountSlug {
  name: string;
  type?: AcType;
  userId?: number;
}

export interface CreateAccountData {
  name: string;
  type: AcType;
  icon?: string;
  userId: number;
  balance: number;
}

export interface UpdateAccountData {
  name?: string;
  type?: AcType;
  icon?: string;
  balance?: number;
}

export interface AccountWhere {
  id: number;
  userId: number;
  slug?: string;
}

export interface FilterAccountWhere {
  userId?: number;
}

export type AccountSummaryPeriod = 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR';

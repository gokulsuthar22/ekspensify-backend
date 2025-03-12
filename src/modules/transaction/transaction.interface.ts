import { PaginationParams } from '@/common/types/pagination.type';
import { TxType } from '@prisma/client';

export interface GenerateTransactionSlug {
  amount: number;
  type: TxType;
  category: string;
  account: string;
  note?: string;
}

export interface handleBudgetTransactionProcessingData {
  txId: number;
  txCreatedAt: Date;
  txAmount: number;
  userId: number;
  accountId: number;
  categoryId: number;
}

export interface CreateTransactionData {
  userId: number;
  accountId: number;
  categoryId: number;
  attachmentId?: number;
  amount: number;
  note?: string;
  type: TxType;
}

export interface TransactionWhere {
  id: number;
  userId: number;
}

export interface UpdateTransactionData {
  accountId?: number;
  categoryId?: number;
  attachmentId?: number;
  note?: string;
  amount?: number;
  type?: TxType;
}

export interface FilterTransactionWhere extends PaginationParams {
  userId?: number;
  accountId?: number | { in: number[] };
  categoryId?: number | { in: number[] };
  note?: string | { contains: string; mode: 'insensitive' };
  amount?: number | { gte: number; lte: number };
  createdAt?: string | { gte: string; lte: string };
  type?: TxType;
  slug?: { contains: string };
  orderBy?: any;
}

export interface UploadAttachmentData {
  image: Express.Multer.File;
  userId: number;
}

export type StatementFileFormat = 'PDF' | 'CSV';

export interface RequestStatementData {
  start: string;
  end: string;
  userId: number;
  email: string;
  name: string;
  format: StatementFileFormat;
}

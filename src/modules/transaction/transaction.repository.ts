import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import { PaginationService } from '@/common/services/pagination.service';
import {
  FilterTransactionWhere,
  GenerateTransactionSlug,
} from './transaction.interface';
import { UtilService } from '@/common/services/util.service';

@Injectable()
export class TransactionRepository {
  constructor(
    private prismaService: PrismaService,
    private accountService: AccountService,
    private paginationService: PaginationService,
    private utilService: UtilService,
  ) {}

  private get Transaction() {
    return this.prismaService.transaction;
  }

  private select = {
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

  private generateSlug(tx: GenerateTransactionSlug) {
    return this.utilService.slugifyText(
      tx.amount.toString(),
      tx.type,
      tx.account,
      tx.category,
      tx?.note,
    );
  }

  private async updateSlug(id: number, slug: string) {
    const category = await this.Transaction.update({
      where: { id },
      data: { slug },
      select: this.select,
    });
    return category;
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    try {
      const tx = await this.prismaService.$transaction(async (ctx) => {
        const tx = await ctx.transaction.create({ data, select: this.select });
        await this.accountService[data.type.toLowerCase()](
          data.accountId,
          data.amount,
          ctx,
        );
        // To not allow balance to be in negative
        // const wallet = await this.accountService[data.type.toLowerCase()](
        //   data.accountId,
        //   data.amount,
        //   ctx,
        // );
        // if (wallet.balance < 0) {
        //   throw new AppHttpException(
        //     HttpStatus.BAD_REQUEST,
        //     'Insufficient balance',
        //   );
        // }
        const slug = this.generateSlug({
          ...tx,
          category: tx.category.name,
          account: tx.account.name,
          amount: +tx.amount,
        });
        return await ctx.transaction.update({
          where: { id: tx.id },
          data: { slug },
          select: this.select,
        });
      });
      return tx;
    } catch (e: any) {
      console.error(e);
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        e instanceof AppHttpException
          ? e.message
          : 'Failed to create transaction',
      );
    }
  }

  async findById(id: number) {
    const transaction = await this.Transaction.findUnique({
      where: { id },
      select: this.select,
    });
    return transaction;
  }

  async findByIdAndUpdate(
    id: number,
    data: Prisma.TransactionUncheckedCreateInput,
  ) {
    let transaction = await this.Transaction.update({
      where: { id },
      data,
      select: this.select,
    });
    if (data.note) {
      const slug = this.generateSlug({
        ...transaction,
        category: transaction.category.name,
        account: transaction.account.name,
        amount: +transaction.amount,
      });
      transaction = await this.updateSlug(transaction.id, slug);
    }
    return transaction;
  }

  async findByIdAndDelete(id: number) {
    const transaction = await this.prismaService.$transaction(async (ctx) => {
      const transaction = await ctx.transaction.delete({
        where: { id },
        select: this.select,
      });
      if (transaction) {
        await this.accountService.credit(
          transaction.accountId,
          +transaction.amount,
        );
      }
      return transaction;
    });
    return transaction;
  }

  async findOne(where: Prisma.TransactionWhereInput) {
    const transaction = await this.Transaction.findFirst({
      where,
      select: this.select,
    });
    return transaction;
  }

  async findOneAndUpdate(
    where: Prisma.TransactionWhereUniqueInput,
    data?: Prisma.TransactionUpdateInput,
  ) {
    let transaction = await this.Transaction.update({
      where,
      data,
      select: this.select,
    });
    if (data.note) {
      const slug = this.generateSlug({
        ...transaction,
        category: transaction.category.name,
        account: transaction.account.name,
        amount: +transaction.amount,
      });
      transaction = await this.updateSlug(transaction.id, slug);
    }
    return transaction;
  }

  async findOneAndDelete(where: Prisma.TransactionWhereUniqueInput) {
    const transaction = await this.prismaService.$transaction(async (ctx) => {
      const transaction = await ctx.transaction.delete({
        where,
        select: this.select,
      });
      if (transaction) {
        await this.accountService.credit(
          transaction.accountId,
          +transaction.amount,
          ctx,
        );
      }
      return transaction;
    });
    return transaction;
  }

  async findMany(where?: FilterTransactionWhere) {
    const sortBy = where?.orderBy;
    delete where?.orderBy;
    const transactions = await this.paginationService.paginate<Transaction>(
      this.Transaction,
      {
        where,
        select: this.select,
        orderBy: sortBy || { createdAt: 'desc' },
      },
    );
    return transactions;
  }

  async findManyWithoutPagination(where?: FilterTransactionWhere) {
    const transactions = await this.Transaction.findMany({
      where,
      select: this.select,
      orderBy: { createdAt: 'desc' },
    });
    return transactions;
  }
}

import { PrismaService } from '@/infra/persistence/prisma/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UtilService } from '@/common/services/util.service';
import {
  AccountWhere,
  CreateAccountData,
  FilterAccountWhere,
  GenerateAccountSlug,
  UpdateAccountData,
} from './account.interface';
import { Account, Prisma } from '@prisma/client';
import { Repository } from '@/common/types/repository.interface';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class AccountRepository
  implements
    Repository<Account, CreateAccountData, UpdateAccountData, AccountWhere>
{
  constructor(
    private prismaService: PrismaService,
    private utilService: UtilService,
  ) {}

  private get Account() {
    return this.prismaService.account;
  }

  private generateSlug(category: GenerateAccountSlug) {
    return this.utilService.slugifyText(
      category.name,
      category?.type,
      category?.userId?.toString(),
    );
  }

  private generateIcon(name: string) {
    return 'ic_' + this.utilService.slugifyText(name).replace(/-/g, '_');
  }

  async create(data: CreateAccountData) {
    const slug = this.generateSlug(data);
    if (!data.icon) {
      data.icon = this.generateIcon(data.name);
    }
    const haveAlreadyAccount = await this.Account.findFirst({
      where: { userId: data.userId, slug },
    });
    if (haveAlreadyAccount) {
      throw new AppHttpException(HttpStatus.CONFLICT, 'Account already exist');
    }
    const account = await this.Account.create({ data: { ...data, slug } });
    return account;
  }

  async findById(id: number) {
    const account = await this.Account.findUnique({ where: { id } });
    return account;
  }

  async findByIdAndUpdate(id: number, data: UpdateAccountData) {
    if (data.name) {
      data.icon = this.generateIcon(data.name);
    }
    let account = await this.Account.update({
      where: { id },
      data,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(account);
      account = await this.Account.update({
        where: account,
        data: { slug },
      });
    }
    return account;
  }

  async findByIdAndDelete(id: number) {
    const account = await this.Account.delete({
      where: { id },
    });
    return account;
  }

  async findOne(where: AccountWhere) {
    const account = await this.Account.findFirst({ where });
    return account;
  }

  async findOneAndUpdate(where: AccountWhere, data?: UpdateAccountData) {
    if (data.name) {
      data.icon = this.generateIcon(data.name);
    }
    let account = await this.Account.update({
      where,
      data,
    });
    if (data.name || data.type) {
      const slug = this.generateSlug(account);
      account = await this.Account.update({
        where: account,
        data: { slug },
      });
    }
    return account;
  }

  async findOneAndDelete(where: AccountWhere) {
    const account = await this.Account.delete({ where });
    return account;
  }

  async findMany(where?: FilterAccountWhere) {
    const accounts = await this.Account.findMany({ where });
    return accounts;
  }

  async credit(
    accountId: number,
    amount: number,
    ctx?: Prisma.TransactionClient,
  ) {
    const wallet = await ctx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    return wallet;
  }

  async debit(
    accountId: number,
    amount: number,
    ctx?: Prisma.TransactionClient,
  ) {
    const wallet = await ctx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
    return wallet;
  }

  async summary(userId: number, startDate: string, endDate: string) {
    const transactions = await this.prismaService.transaction.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let credit = 0;
    let debit = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'CREDIT') {
        credit = +transaction._sum.amount || 0;
      } else if (transaction.type === 'DEBIT') {
        debit = +transaction._sum.amount || 0;
      }
    });

    const total = credit + debit;

    return { total, credit, debit };
  }
}

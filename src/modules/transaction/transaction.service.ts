import { HttpStatus, Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import {
  CreateTransactionData,
  FilterTransactionWhere,
  handleBudgetTransactionProcessingData,
  RequestStatementData,
  TransactionWhere,
  UpdateTransactionData,
  UploadAttachmentData,
} from './transaction.interface';
import { MediaRepository } from '@/helper/media/media.repository';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import { AwsS3Service } from '@/helper/media/services/aws-s3.service';
import { BudgetRepository } from '../budget/budget.repository';
import { BudgetTransactionRepository } from '../budget/repositories/budget-transaction.repository';
import { BudgetReportRepository } from '../budget/repositories/budget-report.repository';
import { MailService } from '@/helper/mail/mail.service';
import { NotificationService } from '@/shared/notification/notification.service';
import * as path from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import * as moment from 'moment';
import * as json2csv from 'json2csv';
import puppeteer from 'puppeteer';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepo: TransactionRepository,
    private budgetRepo: BudgetRepository,
    private budgetReportRepo: BudgetReportRepository,
    private budgetTransactionRepo: BudgetTransactionRepository,
    private mediaRepo: MediaRepository,
    private awsS3Service: AwsS3Service,
    private mailService: MailService,
    private notificationService: NotificationService,
  ) {}

  private async validateAttachment(id: number) {
    const attachment = await this.mediaRepo.findOne({
      id,
    });
    if (!attachment) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Attachment does not exist by id ${id}`,
      );
    }
    if (attachment.entityId) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Attachment belongs to another transaction',
      );
    }
    return attachment;
  }

  private async handleBudgetTransactionProcessing(
    data: handleBudgetTransactionProcessingData,
  ) {
    const budgets = await this.budgetRepo.findActiveBudgetsByDate(
      data.userId,
      data.txCreatedAt,
      data.accountId,
      data.categoryId,
    );

    if (!budgets.length) return;

    for (let budget of budgets) {
      const budgetTx = await this.budgetTransactionRepo.create({
        budgetId: budget.id,
        reportId: budget.reportId,
        transactionId: data.txId,
        amount: data.txAmount,
      });

      const totalPeriodAmt =
        await this.budgetTransactionRepo.calTotalPeriodAmount(
          budgetTx.reportId,
        );

      const totalReportTx = await this.budgetTransactionRepo.calTotalReportTx(
        budgetTx.reportId,
      );

      const [__, updatedBudget] = await Promise.all([
        this.budgetReportRepo.update(budget.reportId, {
          amount: totalPeriodAmt,
          totalTransactions: totalReportTx,
        }),
        this.budgetRepo.updateById(budget.id, {
          spent: totalPeriodAmt,
        }),
      ]);

      const prevSpent = budget.spent;
      const percentBefore = (+prevSpent / +updatedBudget.limit) * 100;
      const percentAfter = (+updatedBudget.spent / +updatedBudget.limit) * 100;

      // Define thresholds in descending order
      const thresholds = [100, 90, 50];
      let notifyThreshold: number | null = null;

      for (const threshold of thresholds) {
        if (percentBefore < threshold && percentAfter >= threshold) {
          notifyThreshold = threshold;
          break; // Stop at the highest threshold crossed
        }
      }

      // If a threshold was crossed, send notification
      if (notifyThreshold !== null) {
        this.notificationService.notifyUser({
          content: `You have reached ${notifyThreshold}% of your ${budget.period.toLowerCase()} budget's limit`,
          userId: [data.userId],
          heading: 'Budget Alert',
          data: { activity: 'BUDGET', id: budget.id },
        });
      }
    }
  }

  async handleDeleteTransaction(data: handleBudgetTransactionProcessingData) {
    const budgetTxns = await this.budgetTransactionRepo.findManyAndDelete({
      transactionId: data.txId,
    });

    if (!budgetTxns.length) return;

    for (let budgetTxn of budgetTxns) {
      const totalPeriodAmt =
        await this.budgetTransactionRepo.calTotalPeriodAmount(
          budgetTxn.reportId,
        );

      const totalReportTx = await this.budgetTransactionRepo.calTotalReportTx(
        budgetTxn.reportId,
      );

      await Promise.all([
        this.budgetReportRepo.update(budgetTxn.reportId, {
          amount: totalPeriodAmt,
          totalTransactions: totalReportTx,
        }),
        this.budgetRepo.updateById(budgetTxn.budgetId, {
          spent: totalPeriodAmt,
        }),
      ]);
    }
  }

  async create(data: CreateTransactionData) {
    if (data.attachmentId) {
      await this.validateAttachment(data.attachmentId);
    }

    const transaction = await this.transactionRepo.create(data);

    if (data.attachmentId) {
      await this.mediaRepo.findByIdAndUpdate(data.attachmentId, {
        entityId: data.attachmentId,
        entityType: 'transaction',
      });
    }

    if (transaction.type === 'DEBIT') {
      await this.handleBudgetTransactionProcessing({
        ...data,
        txId: transaction.id,
        txAmount: +transaction.amount,
        txCreatedAt: transaction.createdAt,
      });
    }

    return transaction;
  }

  async update(where: TransactionWhere, data: UpdateTransactionData) {
    if (!data.attachmentId) {
      delete data?.attachmentId;
    }
    if (data.attachmentId) {
      const attachment = await this.validateAttachment(data.attachmentId);
      await this.mediaRepo.findByIdAndUpdate(attachment.id, {
        entityId: where.id,
        entityType: 'transaction',
      });
    }
    const Transaction = await this.transactionRepo.findOneAndUpdate(
      where,
      data,
    );
    if (!Transaction) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Transaction not found');
    }
    return Transaction;
  }

  async delete(where: TransactionWhere) {
    const transaction = await this.transactionRepo.findOneAndDelete(where);

    if (!transaction) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'Transaction not found');
    }

    await this.handleDeleteTransaction({
      accountId: transaction.accountId,
      categoryId: transaction.category.id,
      txAmount: +transaction.amount,
      txCreatedAt: transaction.createdAt,
      txId: transaction.id,
      userId: where.userId,
    });

    return transaction;
  }

  async findMany(where?: FilterTransactionWhere) {
    const transactions = await this.transactionRepo.findMany(where);
    return transactions;
  }

  async uploadAttachment(data: UploadAttachmentData) {
    const name = this.awsS3Service.getObjectKey(
      data.image.originalname,
      'png',
      'transactions',
    );
    const path = this.awsS3Service.getObjectUrl(name);
    const [attachment] = await Promise.all([
      this.mediaRepo.create({
        name: data.image.originalname,
        path: path,
        size: data.image.size,
        mime: data.image.mimetype,
        userId: data.userId,
      }),
      this.awsS3Service.upload(data.image.buffer, name, data.image.mimetype),
    ]);
    return attachment;
  }

  async requestStatement(data: RequestStatementData) {
    const transactions = await this.transactionRepo.findManyWithoutPagination({
      createdAt: { gte: new Date(data.start), lte: new Date(data.end) } as any,
      userId: data.userId,
    });

    if (!transactions.length) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'No transactions found for the given period',
      );
    }

    const preparedTransactions =
      this.prepareTransactionsForStatement(transactions);

    if (data.format === 'PDF') {
      var fileBuffer = await this.generateStatementPdf(preparedTransactions);
    }

    if (data.format === 'CSV') {
      var fileBuffer = await this.generateStatementCsv(preparedTransactions);
    }

    await this.mailService.sendStatementMail(data.email, {
      file: fileBuffer,
      type: data.format,
      name: data.name,
    });
  }

  async generateStatementPdf(transactions: any[]): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      'views/transactions-list.hbs',
    );
    const source = fs.readFileSync(templatePath, 'utf-8');

    // Compile the Handlebars template
    const template = hbs.compile(source);

    const html = template({ transactions });

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(html);

    // Generate the PDF and save it to the provided output path
    const pdfBuffer = Buffer.from((await page.pdf({ format: 'A4' })).buffer);

    await browser.close();

    return pdfBuffer;
  }

  async generateStatementCsv(transactions: any[]): Promise<Buffer> {
    const fields = [
      { label: 'Sr. No', value: 'srNo' },
      { label: 'Amount', value: 'amount' },
      { label: 'Type', value: 'type' },
      { label: 'Note', value: 'note' },
      { label: 'Category', value: 'category' },
      { label: 'Account', value: 'account' },
      { label: 'Date', value: 'date' },
    ];

    const json2csvParser = new json2csv.Parser({ fields });

    const csvBuffer = Buffer.from(json2csvParser.parse(transactions));

    return csvBuffer;
  }

  prepareTransactionsForStatement(transactions: any[]) {
    return transactions.map((t, i) => {
      return {
        srNo: i + 1,
        amount: t.amount,
        type: t.type,
        note: t.note ? t.note : '-',
        category: t.category.name,
        account: t.account.name,
        date: moment(t.createdAt).format('DD-MM-YYYY'),
      };
    });
  }
}

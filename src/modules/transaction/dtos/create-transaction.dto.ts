import { TxType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @Expose({ name: 'account_id' })
  @IsNumber({}, { message: '`account_id` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  accountId: number;

  @Expose({ name: 'category_id' })
  @IsNumber({}, { message: '`category_id` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  categoryId: number;

  @Expose({ name: 'attachment_id' })
  @IsNumber({}, { message: '`attachment_id` must be a number' })
  @Type(() => Number)
  @IsOptional()
  attachmentId?: number;

  @Expose()
  @IsNumber({}, { message: '`amount` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;

  @Expose()
  @IsString({ message: '`note` must be a string' })
  @IsOptional()
  note?: string;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], { message: "`type` must be 'CREDIT' or 'DEBIT'" })
  @IsString({ message: '`type` must be a string' })
  @IsNotEmpty()
  type: TxType;
}

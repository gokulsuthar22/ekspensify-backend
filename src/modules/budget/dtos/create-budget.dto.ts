import { BudgetPeriod, BudgetType } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import * as moment from 'moment';

export class CreateBudgetDto {
  @Expose()
  @IsNumber({}, { message: '`limit` must be a number' })
  @Type(() => Number)
  @IsNotEmpty()
  limit: number;

  @Expose({ name: 'account_ids' })
  @IsOptional()
  @Transform(({ obj }) => {
    return (
      obj.account_ids?.map((i: any) => {
        return { accountId: i };
      }) || []
    );
  })
  budgetAccounts?: any[];

  @Expose({ name: 'category_ids' })
  @IsOptional()
  @Transform(({ obj }) => {
    return (
      obj.category_ids?.map((i) => {
        return { categoryId: i };
      }) || []
    );
  })
  budgetCategories?: any[];

  @Expose()
  @IsIn(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'], {
    message:
      "`period` must be 'DAILY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY' or 'YEARLY'",
  })
  @IsString({ message: '`period` must be a string' })
  @IsNotEmpty()
  period: BudgetPeriod;

  @Expose()
  @IsIn(['RECURRING', 'EXPIRING'], {
    message: "`type` must be 'RECURRING' or 'EXPIRING'",
  })
  @IsString({ message: '`type` must be a string' })
  @IsNotEmpty()
  type: BudgetType;

  @Expose({ name: 'start_date' })
  @Transform(({ obj }) => {
    return obj?.start_date
      ? moment(obj.start_date).utc().toDate()
      : moment().utc().toDate();
  })
  @IsNotEmpty()
  startDate: string;

  @Expose({ name: 'end_date' })
  @Transform(({ obj }) => {
    return obj?.end_date ? moment(obj.end_date).utc().toDate() : undefined;
  })
  @ValidateIf((o: CreateBudgetDto) => o.type === 'EXPIRING')
  @IsNotEmpty()
  endDate?: string;
}

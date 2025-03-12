import { AccountDto } from '@/modules/account/dtos/account.dto';
import { CategoryDto } from '@/modules/category/dtos/category.dto';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BudgetDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => Number)
  limit: number;

  @Expose()
  @Type(() => Number)
  spent: number;

  @Expose({ name: 'budgetAccounts' })
  @Transform(({ obj }) => {
    return plainToInstance(
      AccountDto,
      obj?.budgetAccounts?.map((b: any) => b?.account),
    );
  })
  @Type(() => AccountDto)
  accounts: AccountDto[];

  @Expose({ name: 'budgetCategories' })
  @Transform(({ obj }) => {
    return plainToInstance(
      CategoryDto,
      obj?.budgetCategories?.map((b: any) => b?.category),
    );
  })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @Expose()
  period: string;

  @Expose({ name: 'periodNo' })
  period_no: number;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose({ name: 'startDate' })
  start_date: string;

  @Expose({ name: 'endDate' })
  @IsOptional()
  end_date?: string;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose({ name: 'updatedAt' })
  updated_at: Date;
}

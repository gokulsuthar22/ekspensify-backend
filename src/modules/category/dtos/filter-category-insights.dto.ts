import { TxType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class FilterCategoryInsightsDto {
  @Expose({ name: 'start_date' })
  @Transform(({ obj }) => {
    return obj?.start_date
      ? moment(obj.start_date).utc().toDate()
      : moment().utc().startOf('week').toDate();
  })
  @IsOptional()
  startDate: string;

  @Expose({ name: 'end_date' })
  @Transform(({ obj }) => {
    return obj?.end_date
      ? moment(obj.end_date).utc().toDate()
      : moment().utc().endOf('week').toDate();
  })
  @IsOptional()
  endDate?: string;

  @Expose()
  @IsIn(['CREDIT', 'DEBIT'], {
    message: "`period` must be 'CREDIT' or 'DEBIT'",
  })
  @IsString({ message: '`type` must be a string' })
  @IsOptional()
  type?: TxType;
}

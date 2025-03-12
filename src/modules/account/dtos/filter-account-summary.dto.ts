import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import * as moment from 'moment';

// export class FilterAccountSummeryDto {
//   @Expose()
//   @IsIn(['THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'], {
//     message: "`period` must be 'THIS_WEEK', 'THIS_MONTH' or 'THIS_YEAR'",
//   })
//   @IsString({ message: '`period` must be a string' })
//   @IsOptional()
//   period?: AccountSummaryPeriod;
// }

export class FilterAccountSummeryDto {
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
}

import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { StatementFileFormat } from '../transaction.interface';

export class RequestStatementDto {
  @Expose({ name: 'start' })
  @IsString({ message: '`start` must be a string' })
  @IsNotEmpty()
  start: string;

  @Expose({ name: 'end' })
  @IsString({ message: '`end` must be a string' })
  @IsNotEmpty()
  end: string;

  @Expose()
  @IsIn(['PDF', 'CSV'], { message: "`format` must be 'PDF' or 'CSV'" })
  @IsString({ message: '`format` must be a string' })
  @IsNotEmpty()
  format: StatementFileFormat;
}

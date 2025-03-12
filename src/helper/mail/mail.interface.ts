import { StatementFileFormat } from '@/modules/transaction/transaction.interface';

export interface OtpMailPaylaod {
  username: string;
  code: number;
}

export interface StatementMailPaylaod {
  name: string;
  file: Buffer;
  type: StatementFileFormat;
}

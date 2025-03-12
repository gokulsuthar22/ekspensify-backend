import { HttpStatus } from '@nestjs/common';

export interface AppHttpError {
  status: HttpStatus;
  message: string;
  reason?: string;
}

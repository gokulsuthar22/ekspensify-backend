import { HttpStatus, PipeTransform } from '@nestjs/common';
import { AppHttpException } from '../exceptions/app-http.exception';

export class ParseIntPipe implements PipeTransform {
  async transform(value: string): Promise<number> {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new AppHttpException(HttpStatus.BAD_REQUEST, 'Invalid `id`');
    }
    return val;
  }
}

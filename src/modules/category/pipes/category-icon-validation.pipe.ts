import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import * as sharp from 'sharp';

@Injectable()
export class CategoryIconValidationPipe implements PipeTransform {
  async transform(value: any) {
    const maxFileSize = 30 * 1024; // 30KB
    const mimeType = 'image/png'; // Only allow PNG files

    if (value.mimetype !== mimeType) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Only PNG files are allowed',
      );
    }

    if (value.size > maxFileSize) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'File size must not exceed 30kb',
      );
    }

    const { width, height } = await sharp(value.buffer).metadata();

    if (width !== 100 || height !== 100) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Icon must be of 100x100 pixels',
      );
    }

    return value;
  }
}

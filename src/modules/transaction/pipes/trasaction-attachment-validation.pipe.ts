import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { AppHttpException } from '@/core/exceptions/app-http.exception';
import * as sharp from 'sharp';

@Injectable()
export class TransactionAttachmentValidationPipe implements PipeTransform {
  async transform(value: any) {
    const maxFileSize = 20 * 1024 * 1024; // 20MB
    const compressUpto = 40;

    if (!value.mimetype.startsWith('image')) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Only image is allowed',
      );
    }

    if (value.size > maxFileSize) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'File size must not exceed 20Mb',
      );
    }

    value.buffer = await sharp(value.buffer)
      .jpeg({ quality: compressUpto })
      .toBuffer();

    return value;
  }
}

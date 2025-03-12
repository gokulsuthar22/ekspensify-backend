import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    // Skip validation for types that do not need validation.
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain object to class instance and exclude extraneous fields.
    const data: object = plainToInstance(metatype, value, {
      excludeExtraneousValues: true,
    });

    // Validate the class instance based on the decorators.
    const errors = await validate(data, {
      whitelist: true,
      stopAtFirstError: true,
    });

    // Extract and report missing fields.
    const requiredFields = errors
      .filter((e) => e.constraints?.isNotEmpty)
      .map((e) => e.property);

    if (requiredFields.length > 0) {
      const message = `Missing fields: ${requiredFields.join(', ')}`;
      throw new AppHttpException(HttpStatus.BAD_REQUEST, message);
    }

    // Extract and report invalid fields with detailed messages.
    const invalidFields = errors.map((e) => Object.values(e.constraints || {}));

    if (invalidFields.length > 0) {
      const message = `Invalid fields: ${invalidFields.flat().join(', ')}`;
      throw new AppHttpException(HttpStatus.BAD_REQUEST, message);
    }

    return data;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

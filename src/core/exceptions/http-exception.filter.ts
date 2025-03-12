import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppHttpException } from './app-http.exception';
import { AppHttpError } from '@/common/types/error.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default error structure
    const error: AppHttpError = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    };

    // Handle custom application exceptions
    if (exception instanceof AppHttpException) {
      const exceptionResponse = exception.getResponse() as AppHttpError;
      Object.assign(error, {
        status: exception.getStatus(),
        reason: exceptionResponse.reason,
        message: exceptionResponse.message,
      });
    }
    // Handle 404 route not found exception explicitly
    else if (exception instanceof NotFoundException) {
      delete error.reason;
      Object.assign(error, {
        status: exception.getStatus(),
        message: 'Route not found',
      });
    }
    // Handle unhandled exceptions
    else {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    this.logger.error(
      'Handled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );

    // Send structured error response
    response.status(error.status).json({ error });
  }
}

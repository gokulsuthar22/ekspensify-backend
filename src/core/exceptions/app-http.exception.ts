import { HttpException, HttpStatus } from '@nestjs/common';

export class AppHttpException extends HttpException {
  constructor(status: HttpStatus, message: string, reason?: string) {
    super({ message, reason, status }, status);
  }
}

// export class AppHttpNotFoundException extends AppHttpException {
//   constructor(reason?: string) {
//     super(HttpStatus.NOT_FOUND, 'Resource not found', reason);
//   }
// }

// export class AppHttpConflictException extends AppHttpException {
//   constructor(reason?: string) {
//     super(HttpStatus.CONFLICT, 'Resource already exist', reason);
//   }
// }

// export class AppHttpBadRequestException extends AppHttpException {
//   constructor(message: string, reason?: string) {
//     super(HttpStatus.BAD_REQUEST, message, reason);
//   }
// }

// export class AppHttpUnauthorizedException extends AppHttpException {
//   constructor(message: string) {
//     super(HttpStatus.UNAUTHORIZED, message);
//   }
// }

// export class AppHttpForbiddenException extends AppHttpException {
//   constructor(reason?: string) {
//     super(HttpStatus.FORBIDDEN, 'Action denied', reason);
//   }
// }

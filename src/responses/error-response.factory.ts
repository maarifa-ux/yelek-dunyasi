import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorResponseFactory {
  private constructor() {}

  static createHttpException(
    statusCode: keyof typeof HttpStatus,
    message: string,
  ) {
    const status = HttpStatus[statusCode];
    return new HttpException(
      {
        isSuccess: false,
        data: null,
        errors: { [statusCode.toLowerCase()]: message },
      },
      status,
    );
  }

  static createNotFoundException(message: string) {
    return ErrorResponseFactory.createHttpException('NOT_FOUND', message);
  }

  static createBadRequestException(message: string) {
    return ErrorResponseFactory.createHttpException('BAD_REQUEST', message);
  }

  static createUnauthorizedException(message: string) {
    return ErrorResponseFactory.createHttpException('UNAUTHORIZED', message);
  }

  static createForbiddenException(message: string) {
    return ErrorResponseFactory.createHttpException('FORBIDDEN', message);
  }

  static createConflictException(message: string) {
    return ErrorResponseFactory.createHttpException('CONFLICT', message);
  }

  static createNotImplementedException(message: string) {
    return ErrorResponseFactory.createHttpException('NOT_IMPLEMENTED', message);
  }

  static createServiceUnavailableException(message: string) {
    return ErrorResponseFactory.createHttpException(
      'SERVICE_UNAVAILABLE',
      message,
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

export class ManipulationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;
    const isAuthPath = path.match(/^\/api\/v\d+\/auth/) !== null;

    if (isAuthPath) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(map((data) => ({ isSuccess: true, data: data, errors: null })));
  }
}

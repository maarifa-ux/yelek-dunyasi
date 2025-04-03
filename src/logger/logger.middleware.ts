/* eslint-disable prettier/prettier */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.verbose(
      `req:, headers:${req.headers['user-agent']}, queries:${
        req.query.filters ?? 'null'
      }, originalUrl:${req.originalUrl}, body:${req.body}`,
    );
    // Ends middleware function execution, hence allowing to move on
    if (next) {
      if (res) {
        const { statusCode, statusMessage } = res;
        let logLevel: string;

        if (statusCode > 199 && statusCode < 299) {
          logLevel = 'log';
        } else if (statusCode > 299 && statusCode < 399) {
          logLevel = 'warn';
        } else if (statusCode > 399 && statusCode < 499) {
          logLevel = 'error';
        } else {
          logLevel = 'fatal';
        }

        this.logger[logLevel](
          `Method: ${
            req.method
          }  response-code:${statusCode}, response message:${
            statusMessage ?? 'null'
          }`,
        );
      }
      next();
    }
  }
}

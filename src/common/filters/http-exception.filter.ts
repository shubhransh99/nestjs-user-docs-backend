import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../../shared/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Handle ValidationPipe errors (BadRequestException with message array)
    if (
      typeof message === 'object' &&
      message !== null &&
      message.message &&
      Array.isArray(message.message)
    ) {
      message = message.message.map((msg: string) => ({
        message: msg,
      }));
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    logger.error(
      `[${request.method}] ${request.url} ${status} - ${JSON.stringify(message)}`,
      {
        context: 'HttpExceptionFilter',
      },
    );

    response.status(status).json(errorResponse);
  }
}

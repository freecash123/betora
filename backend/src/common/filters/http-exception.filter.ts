import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); const response = ctx.getResponse(); const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : '');
    response.status(status).json({ success: false, error: { code: this.getErrorCode(status), message, timestamp: new Date().toISOString(), path: request.url } });
  }
  private getErrorCode(s:number):string {
    switch(s) { case 400: return 'BAD_REQUEST'; case 401: return 'UNAUTHORIZED'; case 403: return 'FORBIDDEN'; case 404: return 'NOT_FOUND'; case 409: return 'CONFLICT'; case 422: return 'VALIDATION_ERROR'; case 429: return 'RATE_LIMITED'; default: return 'INTERNAL_ERROR'; }
  }
}
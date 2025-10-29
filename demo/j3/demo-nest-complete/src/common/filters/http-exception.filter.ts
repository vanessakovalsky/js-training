// === FILTRE GLOBAL D'EXCEPTIONS HTTP ===

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Erreur interne du serveur';

        // Logger l'erreur
        this.logger.error(
            `${request.method} ${request.url} - Status: ${status}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        // Formater la réponse
        const errorResponse = {
            succes: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string' ? message : (message as any).message,
            ...(typeof message === 'object' && message !== null ? message : {}),
        };

        response.status(status).json(errorResponse);
    }
}   
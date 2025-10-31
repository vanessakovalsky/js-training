// === FILTRE D'EXCEPTION DE VALIDATION ===

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(BadRequestException)
  export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
  
      // Formater les erreurs de validation
      const errors = exceptionResponse.message || [];
  
      response.status(status).json({
        succes: false,
        statusCode: status,
        erreur: 'Erreur de validation',
        details: Array.isArray(errors) ? errors : [errors],
        timestamp: new Date().toISOString(),
      });
    }
  }
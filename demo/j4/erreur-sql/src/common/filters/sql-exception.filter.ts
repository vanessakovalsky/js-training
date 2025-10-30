// === FILTRE D'EXCEPTION SQL ===

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch()
export class SqlExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        // Logger l'erreur
        this.logger.error(
            `Erreur SQL: ${exception.message}`,
            exception.stack,
        );

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erreur interne du serveur';
        let details = null;

        // Gérer les erreurs SQL spécifiques
        if (exception.code) {
            switch (exception.code) {
                case 'ER_DUP_ENTRY':
                    status = HttpStatus.CONFLICT;
                    message = 'Cette valeur existe déjà';

                    // Extraire le champ du message d'erreur
                    const match = exception.message.match(/for key '(.+?)'/);
                    if (match) {
                        const key = match[1];
                        if (key.includes('email')) {
                            message = 'Cet email est déjà utilisé';
                        } else if (key.includes('PRIMARY')) {
                            message = 'Cet identifiant existe déjà';
                        }
                    }
                    break;

                case 'ER_NO_REFERENCED_ROW_2':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Référence invalide';

                    if (exception.message.includes('client_id')) {
                        message = 'Client inexistant';
                    } else if (exception.message.includes('produit_id')) {
                        message = 'Produit inexistant';
                    }
                    break;

                case 'ER_ROW_IS_REFERENCED_2':
                    status = HttpStatus.CONFLICT;
                    message = 'Impossible de supprimer : des données associées existent';
                    break;

                case 'ER_DATA_TOO_LONG':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Données trop longues pour le champ';
                    break;

                case 'ER_BAD_NULL_ERROR':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Champ requis manquant';

                    const nullMatch = exception.message.match(/Column '(.+?)'/);
                    if (nullMatch) {
                        message = `Le champ "${nullMatch[1]}" est requis`;
                    }
                    break;

                case 'ER_TRUNCATED_WRONG_VALUE':
                    status = HttpStatus.BAD_REQUEST;
                    message = 'Format de donnée invalide';
                    break;

                case 'ECONNREFUSED':
                    status = HttpStatus.SERVICE_UNAVAILABLE;
                    message = 'Base de données non disponible';
                    break;

                default:
                    this.logger.error(`Code d'erreur SQL non géré: ${exception.code}`);
            }
        }

        // Si c'est déjà une exception HTTP NestJS
        if (exception.getStatus && typeof exception.getStatus === 'function') {
            status = exception.getStatus();
            message = exception.message;

            if (exception.getResponse) {
                const response = exception.getResponse();
                if (typeof response === 'object') {
                    details = response;
                }
            }
        }

        response.status(status).json({
            succes: false,
            statusCode: status,
            message,
            details,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
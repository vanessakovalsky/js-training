// === EXCEPTION SOLDE INSUFFISANT ===

import { HttpException, HttpStatus } from '@nestjs/common';

export class SoldeInsuffisantException extends HttpException {
  constructor(client: string, montantRequis: number, soldeDisponible: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Solde insuffisant',
        message: `Solde insuffisant pour ${client}`,
        details: {
          montantRequis: montantRequis.toFixed(2) + '€',
          soldeDisponible: soldeDisponible.toFixed(2) + '€',
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
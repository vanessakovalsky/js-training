// === EXCEPTION STOCK INSUFFISANT ===

import { HttpException, HttpStatus } from '@nestjs/common';

export class StockInsuffisantException extends HttpException {
  constructor(produit: string, demande: number, disponible: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Stock insuffisant',
        message: `Stock insuffisant pour "${produit}"`,
        details: {
          quantiteDemandee: demande,
          quantiteDisponible: disponible,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
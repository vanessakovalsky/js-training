import { HttpException, HttpStatus } from '@nestjs/common';

export class LimiteStockDepasseeException extends HttpException {
  constructor(quantite: number, limite: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Limite de stock dépassée',
        message: `La quantité (${quantite}) dépasse la limite autorisée (${limite})`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
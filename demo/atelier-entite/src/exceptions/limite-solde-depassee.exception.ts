import { HttpException, HttpStatus } from '@nestjs/common';

export class LimiteSoldeDepasseeException extends HttpException {
  constructor(montant: number, limite: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Limite de solde dépassée',
        message: `Le montant (${montant}€) dépasse la limite autorisée (${limite}€)`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
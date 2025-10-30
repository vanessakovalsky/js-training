// === DTO DE CRÉATION RÉSERVATION ===
import { IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  produitId: number;

  @IsNumber()
  quantite: number;
}
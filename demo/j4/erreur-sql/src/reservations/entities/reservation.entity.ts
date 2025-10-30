// === ENTITÉ RÉSERVATION ===

export class Reservation {
    id: number;
    clientId: number;
    produitId: number;
    quantite: number;
    montantTotal: number;
    dateReservation?: Date;
    statut?: 'confirmee' | 'annulee';
  }
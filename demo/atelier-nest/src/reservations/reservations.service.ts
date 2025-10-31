// === SERVICE DES RÉSERVATIONS ===

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { SoldesService } from 'src/soldes/soldes.service';
import { ClientService } from 'src/client/client.service';
import { LoggerService } from 'src/common/logger.service';

@Injectable()
export class ReservationsService {
  private reservations: Reservation[] = [];
  private nextId = 1;

  constructor(
    private readonly produitsService: SoldesService,
    private readonly clientsService: ClientService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('ReservationsService initialisé');
  }

  /**
   * Créer une réservation
   */
  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { clientId, produitId, quantite } = createReservationDto;

    this.logger.log(`Création réservation: client ${clientId}, produit ${produitId}, qté ${quantite}`);

    // 1. Vérifier que le client existe
    const client = this.clientsService.findOne(clientId);
    if (!client) {
      throw new NotFoundException(`Client #${clientId} non trouvé`);
    }

    // 2. Vérifier que le produit existe
    const produit = this.produitsService.obtenirProduitSoldeParId(produitId);
    if (!produit) {
      throw new NotFoundException(`Produit #${produitId} non trouvé`);
    }

    // 3. Vérifier le stock disponible
    if (produit.stock < quantite) {
      this.logger.error(`Stock insuffisant pour produit #${produitId}`);
      throw new BadRequestException(
        `Stock insuffisant (demandé: ${quantite}, disponible: ${produit.stock})`,
      );
    }

    // 4. Calculer le montant total
    const montantTotal = produit.prixOriginal * quantite;

    // 5. Vérifier le solde du client
    if (client.solde < montantTotal) {
      this.logger.error(`Solde insuffisant pour client #${clientId}`);
      throw new BadRequestException(
        `Solde insuffisant (requis: ${montantTotal}€, disponible: ${client.solde}€)`,
      );
    }

    // 6. Créer la réservation
    const reservation: Reservation = {
      id: this.nextId++,
      clientId,
      produitId,
      quantite,
      montantTotal,
      dateReservation: new Date(),
      statut: 'confirmee',
    };

    this.reservations.push(reservation);

    // // 7. Mettre à jour le stock
    // this.produitsService.update(produitId, {
    //   quantite: produit.quantite - quantite,
    // });

    // // 8. Déduire du solde
    // this.clientsService.retirerSolde(clientId, montantTotal);

    this.logger.log(`Réservation #${reservation.id} créée avec succès`);

    return reservation;
  }

  /**
   * Obtenir toutes les réservations
   */
  findAll(): Reservation[] {
    return this.reservations;
  }

  /**
   * Obtenir les réservations d'un client
   */
  findByClient(clientId: number): Reservation[] {
    return this.reservations.filter((r) => r.clientId === clientId);
  }

  /**
   * Annuler une réservation
   */
  cancel(id: number): Reservation {
    const reservation = this.reservations.find((r) => r.id === id);

    if (!reservation) {
      throw new NotFoundException(`Réservation #${id} non trouvée`);
    }

    if (reservation.statut === 'annulee') {
      throw new BadRequestException('Réservation déjà annulée');
    }

    // Marquer comme annulée
    reservation.statut = 'annulee';

    // // Rembourser le client
    // this.clientsService.rechargerSolde(
    //   reservation.clientId,
    //   reservation.montantTotal,
    // );

    // Remettre en stock
    const produit = this.produitsService.obtenirProduitSoldeParId(reservation.produitId);
    // this.produitsService.update(reservation.produitId, {
    //   quantite: produit.quantite + reservation.quantite,
    // });

    this.logger.log(`Réservation #${id} annulée et remboursée`);

    return reservation;
  }
}
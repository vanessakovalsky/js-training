// === REPOSITORY DES RÉSERVATIONS ===

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Reservation } from './entities/reservation.entity';

interface ReservationWithDetails extends Reservation {
  client_nom: string;
  client_prenom: string;
  client_email: string;
  produit_nom: string;
  produit_prix: number;
}

@Injectable()
export class ReservationsRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Obtenir toutes les réservations avec détails
   */
  async findAll(): Promise<ReservationWithDetails[]> {
    return this.db.query<ReservationWithDetails>(`
      SELECT 
        r.*,
        c.nom as client_nom,
        c.prenom as client_prenom,
        c.email as client_email,
        p.nom as produit_nom,
        p.prix as produit_prix
      FROM reservations r
      INNER JOIN clients c ON r.client_id = c.id
      INNER JOIN produits p ON r.produit_id = p.id
      ORDER BY r.date_reservation DESC
    `);
  }

  /**
   * Obtenir une réservation par ID
   */
  async findById(id: number): Promise<Reservation | null> {
    const [reservation] = await this.db.query<Reservation>(
      'SELECT * FROM reservations WHERE id = ?',
      [id],
    );
    return reservation || null;
  }

  /**
   * Obtenir les réservations d'un client
   */
  async findByClient(clientId: number): Promise<ReservationWithDetails[]> {
    return this.db.query<ReservationWithDetails>(`
      SELECT 
        r.*,
        p.nom as produit_nom,
        p.prix as produit_prix
      FROM reservations r
      INNER JOIN produits p ON r.produit_id = p.id
      WHERE r.client_id = ?
      ORDER BY r.date_reservation DESC
    `, [clientId]);
  }

  /**
   * Créer une réservation (dans une transaction)
   */
  async create(
    connection: any,
    clientId: number,
    produitId: number,
    quantite: number,
    montantTotal: number,
  ): Promise<Reservation> {
    const [result] = await connection.execute(
      'INSERT INTO reservations (client_id, produit_id, quantite, montant_total) VALUES (?, ?, ?, ?)',
      [clientId, produitId, quantite, montantTotal],
    );

    const [reservation] = await connection.execute(
      'SELECT * FROM reservations WHERE id = ?',
      [result.insertId],
    );

    return reservation[0];
  }

  /**
   * Annuler une réservation
   */
  async cancel(connection: any, id: number): Promise<boolean> {
    const [result] = await connection.execute(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      ['annulee', id],
    );

    return result.affectedRows > 0;
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(): Promise<any> {
    const [stats] = await this.db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN statut = 'confirmee' THEN 1 END) as confirmees,
        COUNT(CASE WHEN statut = 'annulee' THEN 1 END) as annulees,
        SUM(CASE WHEN statut = 'confirmee' THEN montant_total ELSE 0 END) as ca_total
      FROM reservations
    `);

    return stats;
  }
}
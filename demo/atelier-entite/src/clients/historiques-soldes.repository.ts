import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

export interface HistoriqueSolde {
    id: number,
    client_id: number;
    type: 'recharge' | 'retrait' | 'reservation' | 'remboursement';
    montant: number;
    solde_avant: number;
    solde_apres: number;
    description?: string;
    date_operation: Date;
}

@Injectable()
export class HistoriqueSoldesRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Enregistrer une opération
   */
  async create(
    clientId: number,
    type: string,
    montant: number,
    soldeAvant: number,
    soldeApres: number,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO historique_soldes 
       (client_id, type, montant, solde_avant, solde_apres) 
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, type, montant, soldeAvant, soldeApres],
    );
  }

  /**
   * Obtenir l'historique d'un client
   */
  async findByClient(clientId: number): Promise<HistoriqueSolde[]> {
    return this.db.query<HistoriqueSolde>(
      'SELECT * FROM historique_soldes WHERE client_id = ? ORDER BY date_operation DESC',
      [clientId],
    );
  }

  /**
   * Obtenir les N dernières opérations
   */
  async findRecent(limit: number = 50): Promise<any[]> {
    return this.db.query(`
      SELECT 
        h.*,
        c.nom as client_nom,
        c.prenom as client_prenom
      FROM historique_soldes h
      INNER JOIN clients c ON h.client_id = c.id
      ORDER BY h.date_operation DESC
      LIMIT ?
    `, [limit]);
  }
}
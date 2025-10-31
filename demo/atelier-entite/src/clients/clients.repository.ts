// === REPOSITORY DES CLIENTS ===

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Client[]> {
    return this.db.query<Client>(
      'SELECT * FROM clients ORDER BY nom, prenom',
    );
  }

  async findById(id: number): Promise<Client | null> {
    const [client] = await this.db.query<Client>(
      'SELECT * FROM clients WHERE id = ?',
      [id],
    );
    return client || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const [client] = await this.db.query<Client>(
      'SELECT * FROM clients WHERE email = ?',
      [email],
    );
    return client || null;
  }

  async create(data: CreateClientDto): Promise<Client|null> {
    const result: any = await this.db.query(
      'INSERT INTO clients (nom, prenom, email, solde) VALUES (?, ?, ?, ?)',
      [data.nom, data.prenom, data.email, data.soldeInitial || 0],
    );

    return this.findById(result.insertId);
  }

  async updateSolde(id: number, nouveauSolde: number): Promise<boolean> {
    const result: any = await this.db.query(
      'UPDATE clients SET solde = ? WHERE id = ?',
      [nouveauSolde, id],
    );

    return result.affectedRows > 0;
  }

  async getStats(): Promise<any> {
    const [stats] = await this.db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(solde) as solde_total,
        AVG(solde) as solde_moyen,
        MIN(solde) as solde_min,
        MAX(solde) as solde_max
      FROM clients
    `);

    return stats;
  }

  async findWithReservations(id: number): Promise<any> {
    // Client avec ses réservations (jointure)
    const client = await this.findById(id);
    if (!client) return null;

    const reservations = await this.db.query(`
      SELECT 
        r.*,
        p.nom as produit_nom,
        p.prix as produit_prix
      FROM reservations r
      INNER JOIN produits p ON r.produit_id = p.id
      WHERE r.client_id = ?
      ORDER BY r.date_reservation DESC
    `, [id]);

    return {
      ...client,
      reservations,
    };
  }
}
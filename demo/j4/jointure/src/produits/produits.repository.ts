// === REPOSITORY DES PRODUITS ===

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Produit } from './entities/produit.entity';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';

@Injectable()
export class ProduitsRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Obtenir tous les produits
   */
  async findAll(): Promise<Produit[]> {
    return this.db.query<Produit>(
      'SELECT * FROM produits ORDER BY id DESC',
    );
  }

  /**
   * Obtenir un produit par ID
   */
  async findById(id: number): Promise<Produit | null> {
    const [produit] = await this.db.query<Produit>(
      'SELECT * FROM produits WHERE id = ?',
      [id],
    );
    return produit || null;
  }

  /**
   * Rechercher des produits
   */
  async search(query: string): Promise<Produit[]> {
    return this.db.query<Produit>(
      'SELECT * FROM produits WHERE nom LIKE ? OR categorie LIKE ?',
      [`%${query}%`, `%${query}%`],
    );
  }

  /**
   * Obtenir par catégorie
   */
  async findByCategorie(categorie: string): Promise<Produit[]> {
    return this.db.query<Produit>(
      'SELECT * FROM produits WHERE categorie = ? ORDER BY nom',
      [categorie],
    );
  }

  /**
   * Créer un produit
   */
  async create(data: CreateProduitDto): Promise<Produit|null> {
    const result: any = await this.db.query(
      'INSERT INTO produits (nom, prix, quantite, categorie) VALUES (?, ?, ?, ?)',
      [data.nom, data.prix, data.quantite, data.categorie || null],
    );

    return this.findById(result.insertId);
  }

  /**
   * Mettre à jour un produit
   */
  async update(id: number, data: UpdateProduitDto): Promise<Produit | null> {
    // Construire la requête dynamiquement
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nom !== undefined) {
      fields.push('nom = ?');
      values.push(data.nom);
    }
    if (data.prix !== undefined) {
      fields.push('prix = ?');
      values.push(data.prix);
    }
    if (data.quantite !== undefined) {
      fields.push('quantite = ?');
      values.push(data.quantite);
    }
    if (data.categorie !== undefined) {
      fields.push('categorie = ?');
      values.push(data.categorie);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result: any = await this.db.query(
      `UPDATE produits SET ${fields.join(', ')} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Supprimer un produit
   */
  async delete(id: number): Promise<boolean> {
    const result: any = await this.db.query(
      'DELETE FROM produits WHERE id = ?',
      [id],
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
        SUM(quantite) as quantite_totale,
        SUM(prix * quantite) as valeur_totale,
        AVG(prix) as prix_moyen
      FROM produits
    `);

    return stats;
  }

  /**
   * Obtenir les produits en stock faible
   */
  async findLowStock(seuil: number = 10): Promise<Produit[]> {
    return this.db.query<Produit>(
      'SELECT * FROM produits WHERE quantite < ? ORDER BY quantite ASC',
      [seuil],
    );
  }
}
// === SERVICE DES PRODUITS ===

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { Produit } from './entities/produit.entity';

@Injectable()
export class ProduitsService {
  // Base de données simulée (en mémoire)
  private produits: Produit[] = [
    {
      id: 1,
      nom: 'Souris sans fil',
      prix: 29.99,
      quantite: 50,
      categorie: 'Périphériques',
      createdAt: new Date(),
    },
    {
      id: 2,
      nom: 'Clavier mécanique',
      prix: 89.99,
      quantite: 15,
      categorie: 'Périphériques',
      createdAt: new Date(),
    },
  ];

  private nextId = 3;

  /**
   * Obtenir tous les produits
   */
  findAll(): Produit[] {
    return this.produits;
  }

  /**
   * Obtenir un produit par ID
   */
  findOne(id: number): Produit {
    const produit = this.produits.find((p) => p.id === id);
    
    if (!produit) {
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }
    
    return produit;
  }

  /**
   * Créer un produit
   */
  create(createProduitDto: CreateProduitDto): Produit {
    const nouveauProduit: Produit = {
      id: this.nextId++,
      ...createProduitDto,
      createdAt: new Date(),
    };

    this.produits.push(nouveauProduit);
    return nouveauProduit;
  }

  /**
   * Mettre à jour un produit
   */
  update(id: number, updateProduitDto: UpdateProduitDto): Produit {
    const produit = this.findOne(id);

    Object.assign(produit, {
      ...updateProduitDto,
      updatedAt: new Date(),
    });

    return produit;
  }

  /**
   * Supprimer un produit
   */
  remove(id: number): Produit {
    const index = this.produits.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    const produitSupprime = this.produits[index];
    this.produits.splice(index, 1);
    
    return produitSupprime;
  }

  /**
   * Rechercher des produits
   */
  search(query: string): Produit[] {
    const lowerQuery = query.toLowerCase();
    return this.produits.filter(
      (p) =>
        p.nom.toLowerCase().includes(lowerQuery) ||
        p.categorie?.toLowerCase().includes(lowerQuery),
    );
  }
}
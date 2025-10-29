import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '../common/services/logger.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { Produit } from './entities/produit.entity';

@Injectable()
export class ProduitsService {
  private produits: Produit[] = [];
  private nextId = 1;

  // Injection du logger
  constructor(private readonly logger: LoggerService) {
    this.logger.log('ProduitsService initialisé');
  }

  findAll(): Produit[] {
    this.logger.log(`Récupération de ${this.produits.length} produits`);
    return this.produits;
  }

  findOne(id: number): Produit {
    this.logger.log(`Recherche du produit #${id}`);
    const produit = this.produits.find((p) => p.id === id);

    if (!produit) {
      this.logger.error(`Produit #${id} non trouvé`);
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    return produit;
  }

  create(createProduitDto: CreateProduitDto): Produit {
    const nouveauProduit: Produit = {
      id: this.nextId++,
      ...createProduitDto,
      createdAt: new Date(),
    };

    this.produits.push(nouveauProduit);
    this.logger.log(`Produit créé: ${nouveauProduit.nom} (ID: ${nouveauProduit.id})`);

    return nouveauProduit;
  }

  remove(id: number): Produit {
    const index = this.produits.findIndex((p) => p.id === id);

    if (index === -1) {
      this.logger.error(`Impossible de supprimer, produit #${id} non trouvé`);
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    const produitSupprime = this.produits.splice(index, 1)[0];
    this.logger.warn(`Produit supprimé: ${produitSupprime.nom} (ID: ${id})`);

    return produitSupprime;
  }
}
// === SERVICE DES PRODUITS (AVEC BASE DE DONNÉES) ===

import { Injectable, NotFoundException } from '@nestjs/common';
import { ProduitsRepository } from './produits.repository';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { Produit } from './entities/produit.entity';
import { LoggerService } from '../common/services/logger.service';
import { AppConfig } from '../common/config/app.config';
import { LimiteStockDepasseeException } from 'src/exceptions/limite-stock-depassee.exception';

@Injectable()
export class ProduitsService {
  constructor(
    private readonly repository: ProduitsRepository,
    private readonly logger: LoggerService,
    private readonly appConfig: AppConfig,
  ) {
    this.logger.log('ProduitsService initialisé avec base de données');
  }

  async findAll(): Promise<Produit[]> {
    this.logger.log('Récupération de tous les produits');
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<Produit> {
    this.logger.log(`Recherche du produit #${id}`);
    const produit = await this.repository.findById(id);

    if (!produit) {
      this.logger.error(`Produit #${id} non trouvé`);
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    return produit;
  }

  async search(query: string): Promise<Produit[]> {
    this.logger.log(`Recherche: "${query}"`);
    return this.repository.search(query);
  }

  async findByCategorie(categorie: string): Promise<Produit[]> {
    return this.repository.findByCategorie(categorie);
  }

  async create(createProduitDto: CreateProduitDto): Promise<Produit|null> {
    const limite = this.appConfig.limites.maxStockParProduit;

    if (createProduitDto.quantite > limite) {
      throw new LimiteStockDepasseeException(createProduitDto.quantite, limite);
    }

    const produit = await this.repository.create(createProduitDto);
    if (produit){
      this.logger.log(`Produit créé: ${produit.nom} (ID: ${produit.id})`);
    }
    return produit;
  }

  async update(id: number, updateProduitDto: UpdateProduitDto): Promise<Produit> {
    const produit = await this.repository.update(id, updateProduitDto);

    if (!produit) {
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    this.logger.log(`Produit mis à jour: ${produit.nom} (ID: ${id})`);
    return produit;
  }

  async remove(id: number): Promise<void> {
    const produit = await this.findOne(id); // Vérifier existence
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }

    this.logger.warn(`Produit supprimé: ${produit.nom} (ID: ${id})`);
  }

  async getStats(): Promise<any> {
    return this.repository.getStats();
  }

  async findLowStock(seuil?: number): Promise<Produit[]> {
    return this.repository.findLowStock(seuil);
  }
}
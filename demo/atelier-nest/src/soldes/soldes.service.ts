import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger.service';
import { Stat } from 'src/entitites/stat.entity';
import { AppConfig } from 'src/common/config/app.config';
import { LimiteStockDepasseeException } from '../common/exceptions/limite-stock-depassee.exception';
import { IsString, IsNumber, validate } from 'class-validator';

export class ProduitSolde {
  @IsNumber()
  id: number;

  @IsString()
  nom: string;
  prixOriginal: number;
  prixSolde: number;
  pourcentageReduction: number;
  stock: number;
  categorie: string;
}

@Injectable()
export class SoldesService {
    constructor(private readonly logger: LoggerService,
                private readonly appConfig: AppConfig
    ) {
        this.logger.log('ProduitService initialisé')
    }
  // Simulation d'une base de données
  private produitsSoldes: ProduitSolde[] = [
    {
      id: 1,
      nom: 'Ordinateur portable Dell',
      prixOriginal: 899.99,
      prixSolde: 699.99,
      pourcentageReduction: 22,
      stock: 15,
      categorie: 'Informatique'
    },
    {
      id: 2,
      nom: 'Souris sans fil Logitech',
      prixOriginal: 49.99,
      prixSolde: 29.99,
      pourcentageReduction: 40,
      stock: 50,
      categorie: 'Accessoires'
    },
    {
      id: 3,
      nom: 'Clavier mécanique RGB',
      prixOriginal: 129.99,
      prixSolde: 89.99,
      pourcentageReduction: 31,
      stock: 25,
      categorie: 'Accessoires'
    }
  ];

  // Récupérer tous les produits en solde
  obtenirTousLesProduitsSoldes(): ProduitSolde[] {
    this.logger.log(`Récupération de ${this.produitsSoldes.length} produits`);
    return this.produitsSoldes;
  }

  // Récupérer un produit en solde par ID
  obtenirProduitSoldeParId(id: number): ProduitSolde {
    const produit = this.produitsSoldes.find(p => p.id === id);
    if (!produit) {
      throw new Error(`Produit avec l'ID ${id} non trouvé`);
    }
    return produit;
  }

  // Filtrer par catégorie
  obtenirProduitsParCategorie(categorie: string): ProduitSolde[] {
    return this.produitsSoldes.filter(
      p => p.categorie.toLowerCase() === categorie.toLowerCase()
    );
  }

  // Filtrer par réduction minimale
  obtenirProduitsAvecReductionMin(pourcentageMin: number): ProduitSolde[] {
    return this.produitsSoldes.filter(
      p => p.pourcentageReduction >= pourcentageMin
    );
  }

  // Mettre à jour le stock après un achat
  mettreAJourStock(id: number, quantite: number): ProduitSolde {
    const produit = this.obtenirProduitSoldeParId(id);
    
    if (produit.stock < quantite) {
      throw new LimiteStockDepasseeException(produit.stock, quantite);

    }
    
    produit.stock -= quantite;
    return produit;
  }

  // Calculer l'économie totale
  calculerEconomie(id: number, quantite: number): number {
    const produit = this.obtenirProduitSoldeParId(id);
    const economie = (produit.prixOriginal - produit.prixSolde) * quantite;
    return Math.round(economie * 100) / 100;
  }

  statistiquesDesProduits(): Stat[] {
    return [
        {
            nom: "nombre de produit",
            valeur: 42
        }
    ];
  }

  ajouterProduit(produit: ProduitSolde): string{
    return 'ok';
  }
}
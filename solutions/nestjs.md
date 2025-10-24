# Solution - Création d'un module soldes avec contrôleur et service

**Durée : 30 minutes**

**Contexte :** Vous devez créer un module pour gérer les soldes des produits dans votre système de gestion de stock. Ce module permettra de consulter les produits en solde et de mettre à jour leurs prix.

## Objectifs

- Créer un module NestJS complet
- Implémenter un contrôleur avec différentes routes
- Créer un service avec la logique métier
- Comprendre l'injection de dépendances

## Étape 1 : Génération du module (5 min)

```bash
# Générer le module complet avec le CLI
nest g module soldes
nest g controller soldes
nest g service soldes
```

Cette commande crée automatiquement :
- `src/soldes/soldes.module.ts`
- `src/soldes/soldes.controller.ts`
- `src/soldes/soldes.service.ts`

## Étape 2 : Créer le service (10 min)

Créez le fichier `src/soldes/soldes.service.ts` :

```typescript
import { Injectable } from '@nestjs/common';

interface ProduitSolde {
  id: number;
  nom: string;
  prixOriginal: number;
  prixSolde: number;
  pourcentageReduction: number;
  stock: number;
  categorie: string;
}

@Injectable()
export class SoldesService {
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
      throw new Error('Stock insuffisant');
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
}
```

## Étape 3 : Créer le contrôleur (10 min)

Créez le fichier `src/soldes/soldes.controller.ts` :

```typescript
import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { SoldesService } from './soldes.service';

@Controller('soldes')
export class SoldesController {
  // Injection du service
  constructor(private readonly soldesService: SoldesService) {}

  // GET /soldes - Récupérer tous les produits en solde
  @Get()
  obtenirTous(@Query('categorie') categorie?: string) {
    if (categorie) {
      return this.soldesService.obtenirProduitsParCategorie(categorie);
    }
    return this.soldesService.obtenirTousLesProduitsSoldes();
  }

  // GET /soldes/:id - Récupérer un produit spécifique
  @Get(':id')
  obtenirUnProduit(@Param('id') id: string) {
    return this.soldesService.obtenirProduitSoldeParId(Number(id));
  }

  // GET /soldes/reduction/:pourcentage - Filtrer par réduction minimale
  @Get('reduction/:pourcentage')
  obtenirParReduction(@Param('pourcentage') pourcentage: string) {
    return this.soldesService.obtenirProduitsAvecReductionMin(Number(pourcentage));
  }

  // PATCH /soldes/:id/stock - Mettre à jour le stock
  @Patch(':id/stock')
  mettreAJourStock(
    @Param('id') id: string,
    @Body('quantite') quantite: number
  ) {
    return this.soldesService.mettreAJourStock(Number(id), quantite);
  }

  // GET /soldes/:id/economie - Calculer l'économie
  @Get(':id/economie')
  calculerEconomie(
    @Param('id') id: string,
    @Query('quantite') quantite: string
  ) {
    const economie = this.soldesService.calculerEconomie(
      Number(id),
      Number(quantite)
    );
    return {
      produitId: Number(id),
      quantite: Number(quantite),
      economieRealisee: economie,
      devise: 'EUR'
    };
  }
}
```

## Étape 4 : Configuration du module (5 min)

Le fichier `src/soldes/soldes.module.ts` devrait ressembler à ceci :

```typescript
import { Module } from '@nestjs/common';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController],
  providers: [SoldesService],
  exports: [SoldesService] // Pour utiliser ce service dans d'autres modules
})
export class SoldesModule {}
```

## Tests avec Postman

### 1. Récupérer tous les produits en solde
```
GET http://localhost:3000/soldes
```

### 2. Filtrer par catégorie
```
GET http://localhost:3000/soldes?categorie=Accessoires
```

### 3. Récupérer un produit spécifique
```
GET http://localhost:3000/soldes/1
```

### 4. Filtrer par réduction minimale (30%)
```
GET http://localhost:3000/soldes/reduction/30
```

### 5. Mettre à jour le stock (achat de 2 unités)
```
PATCH http://localhost:3000/soldes/1/stock
Body: { "quantite": 2 }
```

### 6. Calculer l'économie pour 3 produits
```
GET http://localhost:3000/soldes/1/economie?quantite=3
```

## Points clés à retenir

1. **Architecture modulaire** : Chaque fonctionnalité est dans son propre module
2. **Injection de dépendances** : Le contrôleur reçoit le service automatiquement
3. **Décorateurs** : `@Controller`, `@Get`, `@Post`, `@Param`, `@Query`, `@Body`
4. **Séparation des responsabilités** : 
   - Contrôleur = gestion des routes HTTP
   - Service = logique métier

## Exercice bonus (si temps disponible)

Ajoutez une méthode dans le service pour :
1. Appliquer une réduction supplémentaire de 10% sur tous les produits d'une catégorie
2. Créer un endpoint pour obtenir le top 3 des meilleures réductions

```typescript
// Dans le service
obtenirTopReductions(limite: number = 3): ProduitSolde[] {
  return [...this.produitsSoldes]
    .sort((a, b) => b.pourcentageReduction - a.pourcentageReduction)
    .slice(0, limite);
}

// Dans le contrôleur
@Get('top-reductions')
obtenirTop(@Query('limite') limite?: string) {
  return this.soldesService.obtenirTopReductions(
    limite ? Number(limite) : 3
  );
}
```

## Questions de réflexion

1. Pourquoi séparer le contrôleur et le service ?
2. Que se passe-t-il si vous essayez d'acheter plus que le stock disponible ?
3. Comment pourriez-vous améliorer la gestion des erreurs ?

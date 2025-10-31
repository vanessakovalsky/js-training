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
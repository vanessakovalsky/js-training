// === CONTRÔLEUR DES PRODUITS ===

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';
import { vendreProduitDTO } from './dto/vendre-produit.dto';

@Controller('produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService) { }

  /**
   * GET /produits
   * Liste tous les produits ou recherche
   */
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) {
      return {
        succes: true,
        data: await this.produitsService.search(search),
        message: `Résultats pour "${search}"`,
      };
    }

    const produits = await this.produitsService.findAll();
    return {
      succes: true,
      data: produits,
      total: produits.length,
    };
  }

  /**
   * POST /produits
   * Créer un nouveau produit
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProduitDto: CreateProduitDto) {
    return {
      succes: true,
      message: 'Produit créé avec succès',
      data: this.produitsService.create(createProduitDto),
    };
  }

  /**
   * PUT /produits/:id
   * Mettre à jour un produit
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProduitDto: UpdateProduitDto,
  ) {
    return {
      succes: true,
      message: 'Produit mis à jour avec succès',
      data: this.produitsService.update(+id, updateProduitDto),
    };
  }

  /**
   * DELETE /produits/:id
   * Supprimer un produit
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return {
      succes: true,
      message: 'Produit supprimé avec succès',
      data: this.produitsService.remove(+id),
    };
  }


  /**
   * GET /produits/categorie/:categorie
   * Filtrer par catégorie
   */
  @Get('categorie/:categorie')
  async findByCategory(@Param('categorie') categorie: string) {
    const produits = await this.produitsService.findAll();
    const filtered = produits.filter((p) => p.categorie === categorie);

    return {
      succes: true,
      data: filtered,
      total: filtered.length,
      categorie,
    };
  }

  /**
   * GET /produits/stats
   * Statistiques des produits
   */
  @Get('stats')
  async getStats() {
    const produits = await this.produitsService.findAll();

    const stats = {
      total: produits.length,
      valeurTotale: produits.reduce((sum, p) => sum + p.prix * p.quantite, 0),
      categories: [...new Set(produits.map((p) => p.categorie))],
    };

    return {
      succes: true,
      data: stats,
    };
  }

  /**
   * PATCH /produits/:id/stock
   * Mettre à jour uniquement le stock
   */
  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body('quantite') quantite: number,
  ) {
    const produit = this.produitsService.update(+id, { quantite });

    return {
      succes: true,
      message: 'Stock mis à jour',
      data: produit,
    };
  }
  /**
 * GET /produits/low-stock
 */
  @Get('low-stock')
  async findLowStock(@Query('seuil') seuil?: string) {
    const produits = await this.produitsService.findLowStock(
      seuil ? parseInt(seuil) : undefined,
    );

    return {
      succes: true,
      data: produits,
      total: produits.length,
    };
  }

  @Post('vendre-produit')
  async vendreProduit(@Body() body: vendreProduitDTO){
    console.log('produit vendu');
    return {
      succes: true,
      message: `Produit vendu ${body.id}`,
    };
  }

  @Get('recherche-parametre')
async searchAdvanced(
  @Query('nom') nom?: string,
  @Query('categorie') categorie?: string,
  @Query('prixMin') prixMin?: string,
  @Query('prixMax') prixMax?: string,
  @Query('quantiteMin') quantiteMin?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const result = await this.produitsService.searchAdvanced({
    nom,
    categorie,
    prixMin: prixMin ? parseFloat(prixMin) : undefined,
    prixMax: prixMax ? parseFloat(prixMax) : undefined,
    quantiteMin: quantiteMin ? parseInt(quantiteMin) : undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return {
    succes: true,
    ...result,
  };
}

  /**
   * GET /produits/:id
   * Obtenir un produit spécifique
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      succes: true,
      data: this.produitsService.findOne(+id),
    };
  }
}
// === CONTRÔLEUR DES clients ===

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
import { Client, ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    /**
     * GET /clients
     * Liste tous les clients ou recherche
     */
    @Get()
    findAll(@Query('search') search?: string) {
        if (search) {
            return {
                succes: true,
                data: this.clientsService.search(search),
                message: `Résultats pour "${search}"`,
            };
        }

        const clients = this.clientsService.findAll();
        return {
            succes: true,
            data: clients,
            total: clients.length,
        };
    }

    /**
     * GET /clients/:id
     * Obtenir un produit spécifique
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return {
            succes: true,
            data: this.clientsService.findOne(+id),
        };
    }

    /**
     * POST /clients
     * Créer un nouveau produit
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() client: Client) {
        return {
            succes: true,
            message: 'Produit créé avec succès',
            data: this.clientsService.create(client),
        };
    }

    /**
     * PUT /clients/:id
     * Mettre à jour un produit
     */
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() client: Client,
    ) {
        return {
            succes: true,
            message: 'Produit mis à jour avec succès',
            data: this.clientsService.update(+id, client),
        };
    }

    /**
     * DELETE /clients/:id
     * Supprimer un produit
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return {
            succes: true,
            message: 'Produit supprimé avec succès',
            data: this.clientsService.remove(+id),
        };
    }


    /**
     * GET /clients/stats
     * Statistiques des clients
     */
    @Get('stats')
    getStats() {
        const clients = this.clientsService.findAll();

        const stats = {
            total: clients.length,
            soldeTotal: clients.reduce((sum, p) => sum + p.solde!, 0),
        };

        return {
            succes: true,
            data: stats,
        };
    }

    /**
     * PATCH /clients/:id/solde
     * Mettre à jour uniquement le solde
     */
    @Patch(':id/solde')
    updateStock(
        @Param('id') id: string,
        @Body('solde') solde: number,
    ) {
        const client = this.clientsService.findOne(Number(id));
        client.solde = solde;
        const produit = this.clientsService.update(+id, client);

        return {
            succes: true,
            message: 'Stock mis à jour',
            data: produit,
        };
    }
}
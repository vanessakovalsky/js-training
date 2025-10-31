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
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    /**
     * GET /clients
     * Liste tous les clients ou recherche
     */
    @Get()
    async findAll() {
        const clients = await this.clientsService.findAll();
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

    @Post(':id/recharge')
    reacharge(@Body() any: any, @Param('id') id: string) {
        const montant = any.montant
        const numId = Number(id);
        return {
            succes: true,
            message: 'Produit créé avec succès',
            data: this.clientsService.rechargerSolde(numId, montant),
        };
    }

    
    @Post(':id/retrait')
    retrait(@Body() any: any, @Param('id') id: string) {
        const montant = any.montant
        const numId = Number(id);
        return {
            succes: true,
            message: 'Retrait effectué avec succès',
            data: this.clientsService.retirerSolde(numId, montant),
        };
    }


    /**
     * GET /clients/stats
     * Statistiques des clients
     */
    @Get('stats')
    async getStats() {
        const clients = await this.clientsService.findAll();

        const stats = {
            total: clients.length,
            soldeTotal: clients.reduce((sum, p) => sum + p.solde!, 0),
        };

        return {
            succes: true,
            data: stats,
        };
    }
}
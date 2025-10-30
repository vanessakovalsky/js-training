import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { LoggerService } from '../common/services/logger.service';
@Injectable()
export class ClientsService {
    constructor(
        private readonly repository: ClientsRepository,
        private readonly logger: LoggerService,
    ) { }
    async findAll() {
        return this.repository.findAll();
    }
    async findOne(id: number) {
        const client = await this.repository.findById(id);
        if (!client) {
            throw new NotFoundException(`Client #${id} non trouvé`);
        }
        return client;
    }
    async create(createClientDto: CreateClientDto) {
        // Vérifier email unique
        // const existing = await this.repository.findByEmail(createClientDto.email);
        // if (existing) {
        //     throw new BadRequestException('Cet email est déjà utilisé');
        // }
        return this.repository.create(createClientDto);
    }
    async rechargerSolde(id: number, montant: number) {
        if (montant <= 0) {
            throw new BadRequestException('Le montant doit être supérieur à 0');
        }
        const client = await this.findOne(id);
        const nouveauSolde = Number(client.solde) + montant;
        await this.repository.updateSolde(id, nouveauSolde);
        return {
            id: client.id,
            nom: client.nom,
            prenom: client.prenom,
            ancienSolde: Number(client.solde),
            montantAjoute: montant,
            nouveauSolde,
        };
    }
    async retirerSolde(id: number, montant: number) {
        if (montant <= 0) {
            throw new BadRequestException('Le montant doit être supérieur à 0');
        }
        const client = await this.findOne(id);
        if (Number(client.solde) < montant) {
            throw new BadRequestException(
                `Solde insuffisant (disponible: ${client.solde}€, demandé: ${montant}€)`,
            );
        }
        const nouveauSolde = Number(client.solde) - montant;
        await this.repository.updateSolde(id, nouveauSolde);
        return {
            id: client.id,
            nom: client.nom,
            prenom: client.prenom,
            ancienSolde: Number(client.solde),
            montantRetire: montant,
            nouveauSolde,
        };
    }
    async getStats() {
        return this.repository.getStats();
    }
    async findWithReservations(id: number) {
        const result = await this.repository.findWithReservations(id);
        if (!result) {
            throw new NotFoundException(`Client #${id} non trouvé`);
        }
        return result;
    }
}
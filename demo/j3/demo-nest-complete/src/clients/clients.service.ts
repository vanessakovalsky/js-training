// === SERVICE DES clients ===

import { Injectable, NotFoundException } from '@nestjs/common';

export class Client {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    solde: number;
    createdAt: Date;
    updatedAt?: Date;
}

@Injectable()
export class ClientsService {
    // Base de données simulée (en mémoire)
    private clients: Client[] = [
        {
            id: 1,
            nom: 'Dujardin',
            prenom: 'Jean',
            solde: 120,
            email: 'jean.dujardin@gmail.com',
            createdAt: new Date(),
        },
        {
            id: 2,
            nom: 'Dupont',
            prenom: 'Thomas',
            solde: 42,
            email: 'thomas.dupont@hotmail.com',
            createdAt: new Date(),
        },
    ];

    private nextId = 3;

    /**
     * Obtenir tous les clients
     */
    findAll(): Client[] {
        return this.clients;
    }

    /**
     * Obtenir un Client par ID
     */
    findOne(id: number): Client {
        const Client = this.clients.find((p) => p.id === id);

        if (!Client) {
            throw new NotFoundException(`Client #${id} non trouvé`);
        }

        return Client;
    }

    /**
     * Créer un Client
     */
    create(client: Client): Client {
        const nouveauClient: Client = {
            id: this.nextId++,
            ...client,
            createdAt: new Date(),
        };

        this.clients.push(nouveauClient);
        return nouveauClient;
    }

    /**
     * Mettre à jour un Client
     */
    update(id: number, client: Client): Client {
        const Client = this.findOne(id);

        Object.assign(Client, {
            ...client,
            updatedAt: new Date(),
        });

        return Client;
    }

    /**
     * Supprimer un Client
     */
    remove(id: number): Client {
        const index = this.clients.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new NotFoundException(`Client #${id} non trouvé`);
        }

        const clientsupprime = this.clients[index];
        this.clients.splice(index, 1);

        return clientsupprime;
    }

    /**
     * Rechercher des clients
     */
    search(query: string): Client[] {
        const lowerQuery = query.toLowerCase();
        return this.clients.filter(
            (p) =>
                p.nom.toLowerCase().includes(lowerQuery) ||
                p.prenom?.toLowerCase().includes(lowerQuery),
        );
    }

    retirerSolde(clientId: number, montant: number) {
        const client = this.findOne(clientId);

        Object.assign(Client, {
            ...client,
            solde: client.solde - montant,
        });
        return client;
    }

    rechargerSolde(clientId: number, montant: number) {
        const client = this.findOne(clientId);

        Object.assign(Client, {
            ...client,
            solde: client.solde + montant,
        });
        return client;
    }

}
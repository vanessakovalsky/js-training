import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {

    private clients = [
        {
            id: 1,
            nom: "dupont",
            prenom: "toto",
            email: "toto.dupont@gmail.com",
            solde: 0
        },
        {
            id: 2,
            nom: "gsdfh",
            prenom: "trzgt",
            email: "trzgt.gsdfh@gmail.com",
            solde: 50
        },
        {
            id: 1,
            nom: "aeztzrt",
            prenom: "vwvw",
            email: "vwvw.aeztzrt@gmail.com",
            solde: 120
        }
    ]

    findAll(): Client[] {
        return this.clients;
    }

    findOne(clientId: number): Client {
        const client = this.clients.find((client) => client.id === clientId);
        if (!client) {
          throw new Error(`Client avec ID ${clientId} introuvable`);
        }
        return client;    
    }
}

import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { SoldesService } from 'src/soldes/soldes.service';
import { Stat } from 'src/entitites/stat.entity';


@Injectable()
export class StatistiquesService {
    constructor(private readonly clientService: ClientService, private readonly produitService: SoldesService){}

    obtenirStatitistique(): Stat[] {
        return this.produitService.statistiquesDesProduits();
    }
}

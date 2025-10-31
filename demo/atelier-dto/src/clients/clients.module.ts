// === MODULE DES ClientS ===

import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';
import { HistoriqueSoldesRepository } from './historiques-soldes.repository';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository, HistoriqueSoldesRepository],
  exports: [ClientsService, ClientsRepository,HistoriqueSoldesRepository], // Pour utiliser dans d'autres modules
})
export class ClientsModule {}
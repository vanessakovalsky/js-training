// === MODULE DES PRODUITS ===

import { Module } from '@nestjs/common';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';
import { ProduitsRepository } from './produits.repository';


@Module({
  controllers: [ProduitsController],
  providers: [ProduitsService, ProduitsRepository],
  exports: [ProduitsService], // Pour utiliser dans d'autres modules
})
export class ProduitsModule {}
// === MODULE DES PRODUITS ===

import { Module } from '@nestjs/common';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';

@Module({
  controllers: [ProduitsController],
  providers: [ProduitsService],
  exports: [ProduitsService], // Pour utiliser dans d'autres modules
})
export class ProduitsModule {}
import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ProduitsModule } from '../produits/produits.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [ProduitsModule, ClientsModule], // ← Importer les modules
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
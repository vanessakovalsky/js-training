import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ProduitsModule } from '../produits/produits.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [ProduitsModule, ClientsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
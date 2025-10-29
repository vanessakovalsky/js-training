import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ProduitsModule } from './produits/produits.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, ClientsModule, ProduitsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

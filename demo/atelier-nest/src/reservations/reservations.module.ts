import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { SoldesModule } from '../soldes/soldes.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [SoldesModule, ClientModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
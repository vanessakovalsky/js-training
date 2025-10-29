import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ProduitsModule } from './produits/produits.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [CommonModule, ProduitsModule, ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

@Module({
  controllers: [SoldesController],
  providers: [SoldesService],
  exports: [SoldesService] // Pour utiliser ce service dans d'autres modules
})
export class SoldesModule {}
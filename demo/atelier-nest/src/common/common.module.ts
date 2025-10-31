import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { StatistiquesService } from './statistiques.service';
import { ClientModule } from 'src/client/client.module';
import { SoldesModule } from 'src/soldes/soldes.module';
import { AppConfig } from './config/app.config';

@Global()
@Module({
  providers: [LoggerService, StatistiquesService, AppConfig],
  exports: [LoggerService, StatistiquesService, AppConfig],
  imports: [ClientModule, SoldesModule]
})
export class CommonModule {}

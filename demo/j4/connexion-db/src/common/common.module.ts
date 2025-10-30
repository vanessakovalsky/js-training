import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { AppConfig } from './config/app.config';

@Global() // Rend le module disponible partout
@Module({
  providers: [LoggerService, AppConfig],
  exports: [LoggerService, AppConfig],
})
export class CommonModule {}
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

@Global() // Rend le module disponible partout
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
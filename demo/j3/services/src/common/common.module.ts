import { Module } from '@nestjs/common';

@Module({})
export class CommonModule {}
import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

@Global() // Rend le module disponible partout
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class CommonModule {}
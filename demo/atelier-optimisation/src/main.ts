import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuration globale de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Erreur si propriétés inconnues
      transform: true,            // Transforme en instance de classe
      transformOptions: {
        enableImplicitConversion: true, // Conversion auto des types
      },
    }),
  );

  // Appliquer le filtre d'exception
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Filtre d'exceptions avec injection du logger
  const logger = app.get(LoggerService);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  // Récupérer le ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  await app.listen(port);

  console.log(`
╔════════════════════════════════════════╗
║   🚀 Application NestJS démarrée       ║
╚════════════════════════════════════════╝

📍 URL: http://localhost:${port}
🌍 Environnement: ${nodeEnv}
📊 API Docs: http://localhost:${port}/api

Appuyez sur Ctrl+C pour arrêter
  `);
}
bootstrap();

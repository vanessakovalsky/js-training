import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenue sur l\'API de gestion de stock !';
  }

  getInfo(): object {
    return {
      nom: 'Stock API',
      version: '1.0.0',
      description: 'API de gestion de stock avec NestJS'
    };
  }
}
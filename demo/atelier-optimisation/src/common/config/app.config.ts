// === CONFIGURATION APPLICATION ===

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get limites() {
    return {
      maxStockParProduit: this.configService.get<number>('MAX_STOCK_PAR_PRODUIT', 1000),
      maxSoldeParClient: this.configService.get<number>('MAX_SOLDE_PAR_CLIENT', 10000),
    };
  }

}
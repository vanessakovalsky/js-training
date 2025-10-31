import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  get limites() {
    return {
      maxStockParProduit: this.configService.get<number>('MAX_STOCK_PAR_PRODUIT', 1000),
      maxSoldeParClient: this.configService.get<number>('MAX_SOLDE_PAR_CLIENT', 10000),
    };
  }
}
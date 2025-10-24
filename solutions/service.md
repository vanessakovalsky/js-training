**Fichier `.env` (ajouter) :**
```env
# Limites métier
MAX_STOCK_PAR_PRODUIT=1000
MAX_SOLDE_PAR_CLIENT=10000
```

**Modifier `src/common/config/app.config.ts` :**
```typescript
@Injectable()
export class AppConfig {
  constructor(private configService: ConfigService) {}

  // ... code existant

  get limites() {
    return {
      maxStockParProduit: this.configService.get<number>('MAX_STOCK_PAR_PRODUIT', 1000),
      maxSoldeParClient: this.configService.get<number>('MAX_SOLDE_PAR_CLIENT', 10000),
    };
  }
}
```

**Créer les exceptions :**

**`src/common/exceptions/limite-stock-depassee.exception.ts` :**
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class LimiteStockDepasseeException extends HttpException {
  constructor(quantite: number, limite: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Limite de stock dépassée',
        message: `La quantité (${quantite}) dépasse la limite autorisée (${limite})`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
```

**`src/common/exceptions/limite-solde-depassee.exception.ts` :**
```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class LimiteSoldeDepasseeException extends HttpException {
  constructor(montant: number, limite: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Limite de solde dépassée',
        message: `Le montant (${montant}€) dépasse la limite autorisée (${limite}€)`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
```

**Modifier `src/produits/produits.service.ts` :**
```typescript
import { AppConfig } from '../common/config/app.config';
import { LimiteStockDepasseeException } from '../common/exceptions/limite-stock-depassee.exception';

@Injectable()
export class ProduitsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly appConfig: AppConfig,
  ) {}

  create(createProduitDto: CreateProduitDto): Produit {
    const limite = this.appConfig.limites.maxStockParProduit;

    if (createProduitDto.quantite > limite) {
      throw new LimiteStockDepasseeException(createProduitDto.quantite, limite);
    }

    // ... reste du code
  }
}
```

**Créer un contrôleur de statistiques :**

**`src/app.controller.ts` :**
```typescript
import { Controller, Get } from '@nestjs/common';
import { ProduitsService } from './produits/produits.service';
import { ClientsService } from './clients/clients.service';
import { ReservationsService } from './reservations/reservations.service';

@Controller()
export class AppController {
  constructor(
    private readonly produitsService: ProduitsService,
    private readonly clientsService: ClientsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Get('stats')
  getGlobalStats() {
    const produits = this.produitsService.findAll();
    const clients = this.clientsService.findAll();
    const reservations = this.reservationsService.findAll();

    const valeurTotaleStock = produits.reduce(
      (sum, p) => sum + p.prix * p.quantite,
      0,
    );

    const soldeTotalClients = clients.reduce((sum, c) => sum + c.solde, 0);

    return {
      succes: true,
      data: {
        produits: {
          total: produits.length,
          valeurStock: valeurTotaleStock.toFixed(2) + '€',
        },
        clients: {
          total: clients.length,
          soldeTotal: soldeTotalClients.toFixed(2) + '€',
        },
        reservations: {
          total: reservations.length,
          confirmees: reservations.filter((r) => r.statut === 'confirmee').length,
          annulees: reservations.filter((r) => r.statut === 'annulee').length,
        },
      },
    };
  }
}
```

**Modifier `src/app.module.ts` pour importer les services :**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ProduitsModule } from './produits/produits.module';
import { ClientsModule } from './clients/clients.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    ProduitsModule,
    ClientsModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

**Tester :**
```bash
# Statistiques globales
GET http://localhost:3000/stats

# Tester la limite de stock
POST http://localhost:3000/produits
{
  "nom": "Produit test",
  "prix": 10,
  "quantite": 2000
}
# ❌ Erreur: Limite de stock dépassée
```

**Points à souligner :**

1. **Configuration centralisée** :
   - Toutes les limites dans .env
   - Facile à modifier par environnement

2. **Validation métier** :
   - Au-delà de la validation de format
   - Règles métier dans le service

3. **Exceptions explicites** :
   - Chaque erreur métier a sa classe
   - Messages clairs et détails

4. **Statistiques transversales** :
   - Utilise plusieurs services
   - Vision globale de l'application

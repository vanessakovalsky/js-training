// === MODULE DES PRODUITS ===

import { Module } from '@nestjs/common';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';

@Module({
  controllers: [ProduitsController],
  providers: [ProduitsService],
  exports: [ProduitsService], // Pour utiliser dans d'autres modules
})
export class ProduitsModule {}
```

**Fichier `src/app.module.ts` (importer le module) :**
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProduitsModule } from './produits/produits.module';

@Module({
  imports: [ProduitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
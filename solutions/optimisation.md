**1. Endpoint de statistiques globales**

**Créer `src/app.controller.ts` :**
```typescript
import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly db: DatabaseService) {}

  @Get('stats')
  async getGlobalStats() {
    // Exécuter toutes les requêtes en parallèle pour optimiser
    const [
      produitsStats,
      clientsStats,
      reservationsStats,
      caStats,
    ] = await Promise.all([
      // Stats produits
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(quantite) as quantite_totale,
          SUM(prix * quantite) as valeur_totale,
          AVG(prix) as prix_moyen
        FROM produits
      `),
      
      // Stats clients
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(solde) as solde_total,
          AVG(solde) as solde_moyen
        FROM clients
      `),
      
      // Stats réservations
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN statut = 'confirmee' THEN 1 END) as confirmees,
          COUNT(CASE WHEN statut = 'annulee' THEN 1 END) as annulees
        FROM reservations
      `),
      
      // CA par mois
      this.db.query(`
        SELECT 
          DATE_FORMAT(date_reservation, '%Y-%m') as mois,
          SUM(montant_total) as ca,
          COUNT(*) as nb_reservations
        FROM reservations
        WHERE statut = 'confirmee'
        GROUP BY mois
        ORDER BY mois DESC
        LIMIT 12
      `),
    ]);

    return {
      succes: true,
      data: {
        produits: {
          total: Number(produitsStats[0].total),
          quantiteTotale: Number(produitsStats[0].quantite_totale) || 0,
          valeurTotale: Number(produitsStats[0].valeur_totale) || 0,
          prixMoyen: Number(produitsStats[0].prix_moyen) || 0,
        },
        clients: {
          total: Number(clientsStats[0].total),
          soldeTotal: Number(clientsStats[0].solde_total) || 0,
          soldeMoyen: Number(clientsStats[0].solde_moyen) || 0,
        },
        reservations: {
          total: Number(reservationsStats[0].total),
          confirmees: Number(reservationsStats[0].confirmees),
          annulees: Number(reservationsStats[0].annulees),
        },
        chiffreAffaires: caStats,
      },
    };
  }
}
```

**Enregistrer dans `app.module.ts` :**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { ProduitsModule } from './produits/produits.module';
import { ClientsModule } from './clients/clients.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
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

**2. Recherche avancée**

**Ajouter dans `src/produits/produits.repository.ts` :**
```typescript
async searchAdvanced(filters: {
  nom?: string;
  categorie?: string;
  prixMin?: number;
  prixMax?: number;
  quantiteMin?: number;
  page?: number;
  limit?: number;
}): Promise<PaginationResult<Produit>> {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  // Construire la clause WHERE dynamiquement
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.nom) {
    conditions.push('nom LIKE ?');
    params.push(`%${filters.nom}%`);
  }

  if (filters.categorie) {
    conditions.push('categorie = ?');
    params.push(filters.categorie);
  }

  if (filters.prixMin !== undefined) {
    conditions.push('prix >= ?');
    params.push(filters.prixMin);
  }

  if (filters.prixMax !== undefined) {
    conditions.push('prix <= ?');
    params.push(filters.prixMax);
  }

  if (filters.quantiteMin !== undefined) {
    conditions.push('quantite >= ?');
    params.push(filters.quantiteMin);
  }

  const whereClause = conditions.length > 0 
    ? 'WHERE ' + conditions.join(' AND ') 
    : '';

  // Requêtes en parallèle
  const [produits, countResult] = await Promise.all([
    this.db.query<Produit>(
      `SELECT * FROM produits ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    ),
    this.db.query<{ total: number }>(
      `SELECT COUNT(*) as total FROM produits ${whereClause}`,
      params,
    ),
  ]);

  const total = Number(countResult[0].total);

  return {
    data: produits,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

**Ajouter au service :**
```typescript
async searchAdvanced(filters: any) {
  return this.repository.searchAdvanced(filters);
}
```

**Ajouter au controller :**
```typescript
@Get('recherche')
async searchAdvanced(
  @Query('nom') nom?: string,
  @Query('categorie') categorie?: string,
  @Query('prixMin') prixMin?: string,
  @Query('prixMax') prixMax?: string,
  @Query('quantiteMin') quantiteMin?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  const result = await this.produitsService.searchAdvanced({
    nom,
    categorie,
    prixMin: prixMin ? parseFloat(prixMin) : undefined,
    prixMax: prixMax ? parseFloat(prixMax) : undefined,
    quantiteMin: quantiteMin ? parseInt(quantiteMin) : undefined,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return {
    succes: true,
    ...result,
  };
}
```

**3. Dashboard admin**

**Créer `src/admin/admin.controller.ts` :**
```typescript
import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly db: DatabaseService) {}

  @Get('dashboard')
  async getDashboard() {
    const [
      topProduits,
      topClients,
      caMois,
      ventesJour,
    ] = await Promise.all([
      // Top 5 produits les plus vendus
      this.db.query(`
        SELECT 
          p.id,
          p.nom,
          SUM(r.quantite) as quantite_vendue,
          SUM(r.montant_total) as ca_total
        FROM produits p
        INNER JOIN reservations r ON p.id = r.produit_id
        WHERE r.statut = 'confirmee'
        GROUP BY p.id, p.nom
        ORDER BY quantite_vendue DESC
        LIMIT 5
      `),

      // Top 5 clients par montant dépensé
      this.db.query(`
        SELECT 
          c.id,
          c.nom,
          c.prenom,
          c.email,
          COUNT(r.id) as nb_reservations,
          SUM(r.montant_total) as total_depense
        FROM clients c
        INNER JOIN reservations r ON c.id = r.client_id
        WHERE r.statut = 'confirmee'
        GROUP BY c.id, c.nom, c.prenom, c.email
        ORDER BY total_depense DESC
        LIMIT 5
      `),

      // CA du mois en cours
      this.db.query(`
        SELECT 
          SUM(montant_total) as ca,
          COUNT(*) as nb_ventes,
          AVG(montant_total) as panier_moyen
        FROM reservations
        WHERE statut = 'confirmee'
          AND YEAR(date_reservation) = YEAR(CURRENT_DATE)
          AND MONTH(date_reservation) = MONTH(CURRENT_DATE)
      `),

      // Ventes des 7 derniers jours
      this.db.query(`
        SELECT 
          DATE(date_reservation) as date,
          COUNT(*) as nb_ventes,
          SUM(montant_total) as ca
        FROM reservations
        WHERE statut = 'confirmee'
          AND date_reservation >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
        GROUP BY DATE(date_reservation)
        ORDER BY date DESC
      `),
    ]);

    return {
      succes: true,
      data: {
        topProduits: topProduits.map(p => ({
          id: p.id,
          nom: p.nom,
          quantiteVendue: Number(p.quantite_vendue),
          caTotal: Number(p.ca_total),
        })),
        topClients: topClients.map(c => ({
          id: c.id,
          nom: `${c.prenom} ${c.nom}`,
          email: c.email,
          nbReservations: Number(c.nb_reservations),
          totalDepense: Number(c.total_depense),
        })),
        moisEnCours: {
          ca: Number(caMois[0]?.ca) || 0,
          nbVentes: Number(caMois[0]?.nb_ventes) || 0,
          panierMoyen: Number(caMois[0]?.panier_moyen) || 0,
        },
        ventesRecentes: ventesJour.map(v => ({
          date: v.date,
          nbVentes: Number(v.nb_ventes),
          ca: Number(v.ca),
        })),
      },
    };
  }
}
```

**Créer le module admin :**
```bash
nest generate module admin
```

**`src/admin/admin.module.ts` :**
```typescript
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
})
export class AdminModule {}
```

**Importer dans `app.module.ts` :**
```typescript
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // ... autres imports
    AdminModule,
  ],
  // ...
})
export class AppModule {}
```

**4. Tests Postman**

**Tester tous les endpoints :**

```bash
# Stats globales
GET http://localhost:3000/stats

# Recherche avancée
GET http://localhost:3000/produits/recherche?nom=souris&prixMax=50

# Recherche avec pagination
GET http://localhost:3000/produits/recherche?categorie=Périphériques&page=1&limit=5

# Dashboard admin
GET http://localhost:3000/admin/dashboard
```

**Collection Postman complète** (à créer) :

```
API Stock - Tests Complets
├── Produits
│   ├── GET Liste tous les produits
│   ├── GET Liste avec pagination
│   ├── GET Recherche simple
│   ├── GET Recherche avancée
│   ├── GET Un produit par ID
│   ├── GET Stock faible
│   ├── POST Créer un produit
│   ├── PUT Mettre à jour un produit
│   └── DELETE Supprimer un produit
├── Clients
│   ├── GET Liste tous les clients
│   ├── GET Un client par ID
│   ├── GET Historique d'un client
│   ├── POST Créer un client
│   ├── POST Recharger un solde
│   └── POST Retirer du solde
├── Réservations
│   ├── GET Liste toutes les réservations
│   ├── GET Réservations d'un client
│   ├── POST Créer une réservation
│   └── DELETE Annuler une réservation
├── Stats & Admin
│   ├── GET Stats globales
│   └── GET Dashboard admin
└── Tests d'erreurs
    ├── POST Email duplicate
    ├── POST Stock insuffisant
    ├── POST Solde insuffisant
    └── GET Ressource inexistante
```

**Points à souligner :**

1. **Optimisation des stats** :
   - Toutes les requêtes en parallèle avec Promise.all
   - Une seule connexion à la BDD
   - Réponse rapide

2. **Recherche dynamique** :
   - Clause WHERE construite dynamiquement
   - Seulement les filtres fournis
   - Flexible et performant

3. **Dashboard** :
   - Données agrégées avec GROUP BY
   - Top N avec LIMIT
   - Jointures optimisées

4. **Tests complets** :
   - Tous les endpoints couverts
   - Tests positifs et négatifs
   - Variables d'environnement

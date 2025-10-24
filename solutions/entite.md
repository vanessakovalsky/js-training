**Créer la table dans MariaDB :**
```sql
USE stock_db;

CREATE TABLE historique_soldes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  type ENUM('recharge', 'retrait', 'reservation', 'remboursement') NOT NULL,
  montant DECIMAL(10, 2) NOT NULL,
  solde_avant DECIMAL(10, 2) NOT NULL,
  solde_apres DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  date_operation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_type (type),
  INDEX idx_date (date_operation)
);
```

**`src/clients/historique-soldes.repository.ts` :**
```typescript
// === REPOSITORY HISTORIQUE SOLDES ===

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface HistoriqueSolde {
  id: number;
  client_id: number;
  type: 'recharge' | 'retrait' | 'reservation' | 'remboursement';
  montant: number;
  solde_avant: number;
  solde_apres: number;
  description?: string;
  date_operation: Date;
}

@Injectable()
export class HistoriqueSoldesRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Enregistrer une opération
   */
  async create(
    connection: any,
    clientId: number,
    type: string,
    montant: number,
    soldeAvant: number,
    soldeApres: number,
    description?: string,
  ): Promise<void> {
    await connection.execute(
      `INSERT INTO historique_soldes 
       (client_id, type, montant, solde_avant, solde_apres, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [clientId, type, montant, soldeAvant, soldeApres, description],
    );
  }

  /**
   * Obtenir l'historique d'un client
   */
  async findByClient(clientId: number): Promise<HistoriqueSolde[]> {
    return this.db.query<HistoriqueSolde>(
      'SELECT * FROM historique_soldes WHERE client_id = ? ORDER BY date_operation DESC',
      [clientId],
    );
  }

  /**
   * Obtenir les N dernières opérations
   */
  async findRecent(limit: number = 50): Promise<any[]> {
    return this.db.query(`
      SELECT 
        h.*,
        c.nom as client_nom,
        c.prenom as client_prenom
      FROM historique_soldes h
      INNER JOIN clients c ON h.client_id = c.id
      ORDER BY h.date_operation DESC
      LIMIT ?
    `, [limit]);
  }
}
```

**Modifier `src/clients/clients.service.ts` :**
```typescript
import { HistoriqueSoldesRepository } from './historique-soldes.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly repository: ClientsRepository,
    private readonly historiqueRepository: HistoriqueSoldesRepository,
    private readonly logger: LoggerService,
  ) {}

  async rechargerSolde(id: number, montant: number) {
    if (montant <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }

    return this.db.transaction(async (connection) => {
      // Récupérer le client
      const [clients] = await connection.execute(
        'SELECT * FROM clients WHERE id = ? FOR UPDATE',
        [id],
      );

      if (clients.length === 0) {
        throw new NotFoundException(`Client #${id} non trouvé`);
      }

      const client = clients[0];
      const soldeAvant = Number(client.solde);
      const soldeApres = soldeAvant + montant;

      // Mettre à jour le solde
      await connection.execute(
        'UPDATE clients SET solde = ? WHERE id = ?',
        [soldeApres, id],
      );

      // Enregistrer dans l'historique
      await this.historiqueRepository.create(
        connection,
        id,
        'recharge',
        montant,
        soldeAvant,
        soldeApres,
        `Recharge de ${montant}€`,
      );

      this.logger.log(`Solde rechargé pour client #${id}: ${montant}€`);

      return {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        ancienSolde: soldeAvant,
        montantAjoute: montant,
        nouveauSolde: soldeApres,
      };
    });
  }

  async retirerSolde(id: number, montant: number) {
    if (montant <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }

    return this.db.transaction(async (connection) => {
      const [clients] = await connection.execute(
        'SELECT * FROM clients WHERE id = ? FOR UPDATE',
        [id],
      );

      if (clients.length === 0) {
        throw new NotFoundException(`Client #${id} non trouvé`);
      }

      const client = clients[0];
      const soldeAvant = Number(client.solde);

      if (soldeAvant < montant) {
        throw new BadRequestException(
          `Solde insuffisant (disponible: ${soldeAvant}€, demandé: ${montant}€)`,
        );
      }

      const soldeApres = soldeAvant - montant;

      await connection.execute(
        'UPDATE clients SET solde = ? WHERE id = ?',
        [soldeApres, id],
      );

      await this.historiqueRepository.create(
        connection,
        id,
        'retrait',
        montant,
        soldeAvant,
        soldeApres,
        `Retrait de ${montant}€`,
      );

      return {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        ancienSolde: soldeAvant,
        montantRetire: montant,
        nouveauSolde: soldeApres,
      };
    });
  }

  async getHistorique(id: number) {
    // Vérifier que le client existe
    await this.findOne(id);
    return this.historiqueRepository.findByClient(id);
  }
}
```

**Ajouter au controller `src/clients/clients.controller.ts` :**
```typescript
/**
 * GET /clients/:id/historique
 */
@Get(':id/historique')
async getHistorique(@Param('id') id: string) {
  const historique = await this.clientsService.getHistorique(+id);

  return {
    succes: true,
    data: historique,
    total: historique.length,
  };
}
```

**Enregistrer dans le module :**
```typescript
import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';
import { HistoriqueSoldesRepository } from './historique-soldes.repository';

@Module({
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsRepository,
    HistoriqueSoldesRepository,
  ],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
```

**Tester :**
```bash
# Recharger un solde
POST http://localhost:3000/clients/1/recharge
{ "montant": 50 }

# Retirer un solde
POST http://localhost:3000/clients/1/retrait
{ "montant": 20 }

# Voir l'historique
GET http://localhost:3000/clients/1/historique

# Réponse attendue
{
  "succes": true,
  "data": [
    {
      "id": 2,
      "client_id": 1,
      "type": "retrait",
      "montant": 20.00,
      "solde_avant": 150.00,
      "solde_apres": 130.00,
      "description": "Retrait de 20€",
      "date_operation": "2025-01-16T10:30:00.000Z"
    },
    {
      "id": 1,
      "client_id": 1,
      "type": "recharge",
      "montant": 50.00,
      "solde_avant": 100.00,
      "solde_apres": 150.00,
      "description": "Recharge de 50€",
      "date_operation": "2025-01-16T10:28:00.000Z"
    }
  ],
  "total": 2
}
```

**Points à souligner :**

1. **Traçabilité** :
   - Historique de toutes les opérations
   - Audit et conformité
   - Debug des problèmes

2. **Transaction** :
   - Opération + historique atomique
   - Si échec, rien n'est enregistré

3. **Index** :
   - Sur client_id pour performances
   - Sur date pour tri rapide

4. **ENUM** :
   - Type contraint en BDD
   - Garantit valeurs valides

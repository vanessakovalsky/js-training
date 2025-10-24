# Gestion des données avec les entités

### Énoncé

**Contexte :**
Migrer complètement l'application vers MariaDB avec SQL brut.

**Tâches à réaliser :**

1. **Créer la table `historique_soldes`**
   ```sql
   CREATE TABLE historique_soldes (
     id INT PRIMARY KEY AUTO_INCREMENT,
     client_id INT NOT NULL,
     type ENUM('recharge', 'retrait', 'reservation', 'remboursement'),
     montant DECIMAL(10, 2) NOT NULL,
     solde_avant DECIMAL(10, 2) NOT NULL,
     solde_apres DECIMAL(10, 2) NOT NULL,
     date_operation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (client_id) REFERENCES clients(id)
   );
   ```

2. **Créer le repository `HistoriqueSoldesRepository`**
   - Méthode `create()` pour enregistrer une opération
   - Méthode `findByClient(clientId)` pour l'historique d'un client
   - Méthode `findRecent(limit)` pour les N dernières opérations

3. **Modifier `ClientsService`**
   - À chaque recharge/retrait, enregistrer dans l'historique
   - Ajouter une méthode `getHistorique(clientId)`

4. **Ajouter un endpoint**
   - `GET /clients/:id/historique` - Historique des opérations

**Critères de réussite :**
- ✅ Table créée avec les bonnes contraintes
- ✅ Repository fonctionnel
- ✅ Historique enregistré automatiquement
- ✅ Endpoint qui retourne l'historique

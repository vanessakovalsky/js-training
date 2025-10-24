# Services et validations

## Énoncé

**Contexte :**
Améliorer l'application avec validation complète et configuration.

**Tâches à réaliser :**

1. **Variables d'environnement**
   - Ajouter MAX_STOCK_PAR_PRODUIT (ex: 1000)
   - Ajouter MAX_SOLDE_PAR_CLIENT (ex: 10000)
   - Utiliser ces limites dans la validation

2. **Validation avancée**
   - Produits : quantité max = MAX_STOCK_PAR_PRODUIT
   - Clients : solde max = MAX_SOLDE_PAR_CLIENT
   - Email unique côté DTO avec validation personnalisée

3. **Exceptions personnalisées**
   - `LimiteStockDepasseeException`
   - `LimiteSoldeDepasseeException`
   - Utiliser dans les services

4. **Statistiques globales**
   - Créer un endpoint GET /stats
   - Retourne : nb produits, nb clients, nb réservations
   - Valeur totale stock, solde total clients

**Critères de réussite :**
- ✅ Variables d'environnement configurées
- ✅ Validation avec limites max
- ✅ Exceptions personnalisées
- ✅ Endpoint de statistiques fonctionnel

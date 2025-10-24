# Optimiser et finaliser son application

## Énoncé

**Contexte :**
Optimiser et finaliser l'application complète.

**Tâches à réaliser :**

1. **Créer un endpoint de statistiques globales**
   - `GET /stats`
   - Retourne toutes les stats (produits, clients, réservations)
   - Utiliser des requêtes optimisées (pas de N+1)

2. **Ajouter un système de recherche avancée**
   - `GET /produits/recherche?nom=...&categorieMin=...&prixMax=...`
   - Recherche multicritères
   - Avec pagination

3. **Créer un dashboard admin**
   - `GET /admin/dashboard`
   - Top 5 produits les plus vendus
   - Top 5 clients (par montant dépensé)
   - CA du mois en cours

4. **Tests Postman complets**
   - Collection avec tous les endpoints
   - Tests automatisés
   - Variables d'environnement

**Critères de réussite :**
- ✅ Endpoint stats fonctionnel
- ✅ Recherche avancée avec filtres
- ✅ Dashboard admin avec requêtes optimisées
- ✅ Collection Postman complète qui passe

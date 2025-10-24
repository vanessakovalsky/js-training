# Premiers pas avec NodeJS

## Énoncé

**Contexte :**
Créer un mini serveur HTTP pour gérer les soldes des clients d'une salle de sport.

**Fichier à créer : `atelier-2-1-serveur-soldes/`**

**Structure attendue :**
```
atelier-2-1-serveur-soldes/
├── clients.json
├── server.js
└── package.json
```

**Fonctionnalités à implémenter :**

1. **GET /api/clients** : Liste tous les clients avec leurs soldes

2. **GET /api/clients/:id** : Obtenir un client spécifique

3. **POST /api/clients/:id/recharge** : Recharger le solde d'un client
   - Corps de requête : `{ "montant": 50 }`
   - Validation : montant > 0

4. **POST /api/clients/:id/retrait** : Retirer du solde
   - Corps de requête : `{ "montant": 20 }`
   - Validation : montant > 0 et solde suffisant

5. **GET /api/stats** : Statistiques
   - Nombre de clients
   - Solde total
   - Solde moyen

**Structure `clients.json` :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Martin",
    "email": "martin.dupont@email.com",
    "solde": 50.00
  }
]
```

**Critères de réussite :**
- ✅ Tous les endpoints fonctionnent
- ✅ Validation des données
- ✅ Codes de statut HTTP corrects
- ✅ Réponses au format JSON
- ✅ Gestion des erreurs

**Exemple de requête :**
```bash
# Recharger un solde
curl -X POST http://localhost:3000/api/clients/1/recharge \
  -H "Content-Type: application/json" \
  -d '{"montant": 25.50}'

# Réponse attendue
{
  "succes": true,
  "message": "Solde rechargé",
  "data": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Martin",
    "ancienSolde": 50.00,
    "nouveauSolde": 75.50
  }
}
```

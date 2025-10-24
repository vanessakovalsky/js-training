# Gestion de l'asynchrone

## Énoncé

**Contexte :**
Vous devez créer un système qui charge automatiquement les soldes clients depuis un fichier JSON, permet de les modifier, et sauvegarde les changements.

**Fichiers à créer :**
- `clients.json` : Base de données
- `atelier-1-2-soldes-json.js` : Application

**Structure du fichier `clients.json` :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Martin",
    "solde": 50.00,
    "email": "martin.dupont@email.com"
  }
]
```

**Fonctionnalités à implémenter :**

1. `chargerClients()` : Charge les clients depuis le fichier JSON
   - Gère le cas où le fichier n'existe pas
   - Retourne un tableau de clients

2. `sauvegarderClients(clients)` : Sauvegarde les clients dans le fichier
   - Formate le JSON proprement (indentation)

3. `rechargerSolde(clientId, montant)` : Ajoute du solde à un client
   - Charge, modifie, sauvegarde
   - Retourne le nouveau solde

4. `afficherSoldes()` : Affiche tous les clients avec leurs informations

5. `genererRapport()` : Génère un rapport avec :
   - Nombre total de clients
   - Solde total
   - Solde moyen
   - Clients avec solde faible (<30€)

**Exemple de sortie attendue :**
```
=== CHARGEMENT DES DONNÉES ===
📂 5 clients chargés depuis clients.json

=== RECHARGE DE SOLDE ===
✅ 25.00€ ajoutés au compte de Martin Dupont
💰 Nouveau solde: 75.00€

=== RAPPORT ===
Clients: 5
Solde total: 325.50€
Solde moyen: 65.10€
Clients avec solde faible: 2

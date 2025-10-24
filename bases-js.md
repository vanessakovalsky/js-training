## Bases de la syntaxe js

**Contexte :**
Vous devez créer un système de gestion des soldes pour des clients d'une salle de sport.

**Fichier à créer : `atelier-1-1-soldes.js`**

**Fonctionnalités à implémenter :**

1. Créer un tableau d'objets représentant 5 clients avec :
   - id (nombre)
   - nom (string)
   - prenom (string)
   - solde (nombre, montant en euros)

2. Créer une fonction `ajouterSolde(clientId, montant)` qui :
   - Trouve le client par son ID
   - Ajoute le montant à son solde
   - Affiche un message de confirmation

3. Créer une fonction `retirerSolde(clientId, montant)` qui :
   - Vérifie que le solde est suffisant
   - Retire le montant
   - Affiche un message (confirmation ou erreur si insuffisant)

4. Créer une fonction `afficherSoldes()` qui :
   - Affiche tous les clients avec leur solde
   - Affiche le solde total de tous les clients

5. Tester vos fonctions avec plusieurs opérations

**Exemple de sortie attendue :**
```
=== SOLDES CLIENTS ===
1. Martin Dupont: 50.00€
2. Sophie Bernard: 75.50€
...
Solde total: 325.50€

✅ 20.00€ ajoutés au compte de Martin Dupont (nouveau solde: 70.00€)
❌ Solde insuffisant pour Sophie Bernard (demandé: 100€, disponible: 75.50€)
```

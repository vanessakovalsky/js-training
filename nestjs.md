#  Module Soldes avec NestJS

**Durée : 30 minutes**

## Contexte

Vous travaillez sur une application de gestion de stock pour un magasin d'informatique. La période des soldes approche et votre responsable vous demande de créer un module dédié pour gérer les produits en promotion.

Le système doit permettre de :
- Consulter tous les produits en solde
- Filtrer les produits par catégorie
- Trouver les meilleures réductions
- Mettre à jour le stock lors d'achats
- Calculer l'économie réalisée par les clients

## Objectifs pédagogiques

- Créer un module NestJS complet de A à Z
- Implémenter un contrôleur avec différentes routes
- Créer un service avec la logique métier
- Comprendre l'injection de dépendances
- Tester les endpoints avec Postman

## Données de départ

Voici les produits en solde que vous devez gérer :

```typescript
[
  {
    id: 1,
    nom: 'Ordinateur portable Dell',
    prixOriginal: 899.99,
    prixSolde: 699.99,
    pourcentageReduction: 22,
    stock: 15,
    categorie: 'Informatique'
  },
  {
    id: 2,
    nom: 'Souris sans fil Logitech',
    prixOriginal: 49.99,
    prixSolde: 29.99,
    pourcentageReduction: 40,
    stock: 50,
    categorie: 'Accessoires'
  },
  {
    id: 3,
    nom: 'Clavier mécanique RGB',
    prixOriginal: 129.99,
    prixSolde: 89.99,
    pourcentageReduction: 31,
    stock: 25,
    categorie: 'Accessoires'
  }
]
```

## Structure attendue

Vous devez créer les fichiers suivants dans le dossier `src/soldes/` :

```
src/soldes/
├── soldes.module.ts
├── soldes.controller.ts
└── soldes.service.ts
```

## Tâches à réaliser

### Étape 1 : Générer le module (5 min)

Utilisez le CLI NestJS pour générer automatiquement la structure :

```bash
nest g module soldes
nest g controller soldes
nest g service soldes
```

### Étape 2 : Créer le service (10 min)

Dans `src/soldes/soldes.service.ts`, créez les méthodes suivantes :

**Interface ProduitSolde**
```typescript
interface ProduitSolde {
  id: number;
  nom: string;
  prixOriginal: number;
  prixSolde: number;
  pourcentageReduction: number;
  stock: number;
  categorie: string;
}
```

**Méthodes à implémenter :**

1. `obtenirTousLesProduitsSoldes()`: Retourne tous les produits
2. `obtenirProduitSoldeParId(id: number)`: Retourne un produit par son ID (erreur si non trouvé)
3. `obtenirProduitsParCategorie(categorie: string)`: Filtre par catégorie
4. `obtenirProduitsAvecReductionMin(pourcentageMin: number)`: Filtre par réduction minimale
5. `mettreAJourStock(id: number, quantite: number)`: Diminue le stock (erreur si stock insuffisant)
6. `calculerEconomie(id: number, quantite: number)`: Calcule l'économie réalisée

💡 **Astuces :**
- N'oubliez pas le décorateur `@Injectable()`
- Utilisez `throw new Error()` pour les erreurs
- Utilisez les méthodes de tableau : `find`, `filter`
- Arrondissez les calculs avec `Math.round(valeur * 100) / 100`

### Étape 3 : Créer le contrôleur (10 min)

Dans `src/soldes/soldes.controller.ts`, créez les routes suivantes :

| Méthode | Route | Description | Paramètres |
|---------|-------|-------------|------------|
| GET | `/soldes` | Tous les produits ou filtrés par catégorie | `?categorie=...` (optionnel) |
| GET | `/soldes/:id` | Un produit spécifique | `:id` dans l'URL |
| GET | `/soldes/reduction/:pourcentage` | Produits avec réduction min | `:pourcentage` dans l'URL |
| PATCH | `/soldes/:id/stock` | Mettre à jour le stock | `:id` + `quantite` dans le body |
| GET | `/soldes/:id/economie` | Calculer l'économie | `:id` + `?quantite=...` |

💡 **Astuces :**
- Utilisez `@Controller('soldes')` pour définir le préfixe
- Injectez le service via le constructeur
- Utilisez `@Get()`, `@Patch()` pour les méthodes HTTP
- `@Param('id')` pour les paramètres d'URL
- `@Query('nom')` pour les query parameters
- `@Body('nom')` pour le corps de la requête
- Convertissez les paramètres en nombre avec `Number(param)`

### Étape 4 : Vérifier le module (5 min)

Le fichier `src/soldes/soldes.module.ts` doit contenir :

```typescript
@Module({
  controllers: [SoldesController],
  providers: [SoldesService],
  exports: [SoldesService] // Pour utiliser ce service ailleurs
})
export class SoldesModule {}
```

## Tests à effectuer avec Postman

Une fois votre module créé, testez les endpoints suivants :

### Test 1 : Récupérer tous les produits
```
GET http://localhost:3000/soldes
```
**Résultat attendu :** Liste des 3 produits

### Test 2 : Filtrer par catégorie
```
GET http://localhost:3000/soldes?categorie=Accessoires
```
**Résultat attendu :** 2 produits (Souris et Clavier)

### Test 3 : Récupérer un produit spécifique
```
GET http://localhost:3000/soldes/1
```
**Résultat attendu :** L'ordinateur Dell

### Test 4 : Filtrer par réduction (30% minimum)
```
GET http://localhost:3000/soldes/reduction/30
```
**Résultat attendu :** 2 produits (Souris 40% et Clavier 31%)

### Test 5 : Mettre à jour le stock
```
PATCH http://localhost:3000/soldes/1/stock
Content-Type: application/json

{
  "quantite": 2
}
```
**Résultat attendu :** Produit avec stock passé de 15 à 13

### Test 6 : Calculer l'économie
```
GET http://localhost:3000/soldes/1/economie?quantite=3
```
**Résultat attendu :** 
```json
{
  "produitId": 1,
  "quantite": 3,
  "economieRealisee": 600.00,
  "devise": "EUR"
}
```

## Critères de réussite

✅ Le module démarre sans erreur  
✅ Tous les endpoints répondent correctement  
✅ Les filtres fonctionnent  
✅ Les erreurs sont gérées (produit inexistant, stock insuffisant)  
✅ Les calculs sont corrects et arrondis  

## Exercice bonus (si temps disponible)

Ajoutez une nouvelle fonctionnalité :

**Route :** `GET /soldes/top-reductions?limite=3`

**Fonctionnalité :** Retourne les X produits avec les meilleures réductions, triés par pourcentage décroissant.

**Exemple de résultat :**
```json
[
  { "id": 2, "nom": "Souris sans fil Logitech", "pourcentageReduction": 40 },
  { "id": 3, "nom": "Clavier mécanique RGB", "pourcentageReduction": 31 },
  { "id": 1, "nom": "Ordinateur portable Dell", "pourcentageReduction": 22 }
]
```

## Questions de réflexion

1. Pourquoi sépare-t-on le contrôleur et le service ?
2. Que se passe-t-il si vous essayez d'acheter 20 souris alors qu'il n'en reste que 50 ?
3. Comment améliorer la gestion des erreurs pour qu'elles soient plus claires ?
4. Comment pourriez-vous persister ces données dans une vraie base de données ?


**Bon courage ! 💪**

Une fois terminé, comparez votre solution avec celle du formateur.

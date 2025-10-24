**Fichier `clients.json` :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Martin",
    "solde": 50.00,
    "email": "martin.dupont@email.com"
  },
  {
    "id": 2,
    "nom": "Bernard",
    "prenom": "Sophie",
    "solde": 75.50,
    "email": "sophie.bernard@email.com"
  },
  {
    "id": 3,
    "nom": "Petit",
    "prenom": "Lucas",
    "solde": 120.00,
    "email": "lucas.petit@email.com"
  },
  {
    "id": 4,
    "nom": "Moreau",
    "prenom": "Emma",
    "solde": 30.00,
    "email": "emma.moreau@email.com"
  },
  {
    "id": 5,
    "nom": "Laurent",
    "prenom": "Thomas",
    "solde": 50.00,
    "email": "thomas.laurent@email.com"
  }
]
```

**Fichier `atelier-1-2-soldes-json.js` :**
```javascript
// === ATELIER 1.2 - GESTION DES SOLDES AVEC JSON ===

import fs from 'fs/promises';

const FICHIER_CLIENTS = 'clients.json';
const SEUIL_SOLDE_FAIBLE = 30;

// === 1. CHARGER LES CLIENTS ===

async function chargerClients() {
  try {
    console.log("📂 Chargement des clients depuis", FICHIER_CLIENTS);
    const data = await fs.readFile(FICHIER_CLIENTS, 'utf-8');
    const clients = JSON.parse(data);
    console.log(`✅ ${clients.length} clients chargés\n`);
    return clients;
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      console.log("⚠️ Fichier non trouvé, création d'une base vide\n");
      return [];
    }
    console.error("❌ Erreur lors du chargement:", erreur.message);
    throw erreur;
  }
}

// === 2. SAUVEGARDER LES CLIENTS ===

async function sauvegarderClients(clients) {
  try {
    const json = JSON.stringify(clients, null, 2);
    await fs.writeFile(FICHIER_CLIENTS, json, 'utf-8');
    return true;
  } catch (erreur) {
    console.error("❌ Erreur lors de la sauvegarde:", erreur.message);
    return false;
  }
}

// === 3. RECHARGER LE SOLDE D'UN CLIENT ===

async function rechargerSolde(clientId, montant) {
  console.log(`\n💳 Recharge de ${montant.toFixed(2)}€ pour le client ${clientId}`);
  
  try {
    // Validation du montant
    if (montant <= 0) {
      throw new Error("Le montant doit être positif");
    }
    
    // Charger les clients
    const clients = await chargerClients();
    
    // Trouver le client
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      console.log(`❌ Client ${clientId} non trouvé`);
      return null;
    }
    
    // Mettre à jour le solde
    const ancienSolde = client.solde;
    client.solde += montant;
    
    // Sauvegarder
    await sauvegarderClients(clients);
    
    console.log(`✅ ${montant.toFixed(2)}€ ajoutés au compte de ${client.prenom} ${client.nom}`);
    console.log(`💰 Ancien solde: ${ancienSolde.toFixed(2)}€`);
    console.log(`💰 Nouveau solde: ${client.solde.toFixed(2)}€`);
    
    return client.solde;
    
  } catch (erreur) {
    console.error(`❌ Erreur: ${erreur.message}`);
    return null;
  }
}

// === 4. RETIRER DU SOLDE ===

async function retirerSolde(clientId, montant) {
  console.log(`\n💸 Retrait de ${montant.toFixed(2)}€ pour le client ${clientId}`);
  
  try {
    if (montant <= 0) {
      throw new Error("Le montant doit être positif");
    }
    
    const clients = await chargerClients();
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      console.log(`❌ Client ${clientId} non trouvé`);
      return null;
    }
    
    if (client.solde < montant) {
      console.log(`❌ Solde insuffisant pour ${client.prenom} ${client.nom}`);
      console.log(`   Demandé: ${montant.toFixed(2)}€, Disponible: ${client.solde.toFixed(2)}€`);
      return null;
    }
    
    const ancienSolde = client.solde;
    client.solde -= montant;
    
    await sauvegarderClients(clients);
    
    console.log(`✅ ${montant.toFixed(2)}€ retirés du compte de ${client.prenom} ${client.nom}`);
    console.log(`💰 Nouveau solde: ${client.solde.toFixed(2)}€`);
    
    return client.solde;
    
  } catch (erreur) {
    console.error(`❌ Erreur: ${erreur.message}`);
    return null;
  }
}

// === 5. AFFICHER TOUS LES SOLDES ===

async function afficherSoldes() {
  const clients = await chargerClients();
  
  console.log("=== SOLDES CLIENTS ===\n");
  
  if (clients.length === 0) {
    console.log("Aucun client enregistré");
    return;
  }
  
  clients.forEach(client => {
    const statut = client.solde < SEUIL_SOLDE_FAIBLE ? "⚠️" : "✅";
    console.log(`${statut} [${client.id}] ${client.prenom} ${client.nom}`);
    console.log(`   Email: ${client.email}`);
    console.log(`   Solde: ${client.solde.toFixed(2)}€`);
    console.log();
  });
}

// === 6. GÉNÉRER UN RAPPORT ===

async function genererRapport() {
  const clients = await chargerClients();
  
  console.log("\n=== RAPPORT DES SOLDES ===\n");
  
  if (clients.length === 0) {
    console.log("Aucun client enregistré");
    return;
  }
  
  const nombreClients = clients.length;
  const soldeTotal = clients.reduce((total, c) => total + c.solde, 0);
  const soldeMoyen = soldeTotal / nombreClients;
  const clientsSoldeFaible = clients.filter(c => c.solde < SEUIL_SOLDE_FAIBLE);
  
  const soldeMin = Math.min(...clients.map(c => c.solde));
  const soldeMax = Math.max(...clients.map(c => c.solde));
  const clientSoldeMin = clients.find(c => c.solde === soldeMin);
  const clientSoldeMax = clients.find(c => c.solde === soldeMax);
  
  console.log("📊 STATISTIQUES GÉNÉRALES");
  console.log(`   Nombre de clients: ${nombreClients}`);
  console.log(`   Solde total: ${soldeTotal.toFixed(2)}€`);
  console.log(`   Solde moyen: ${soldeMoyen.toFixed(2)}€`);
  console.log();
  
  console.log("📈 EXTRÊMES");
  console.log(`   Solde minimum: ${soldeMin.toFixed(2)}€ (${clientSoldeMin.prenom} ${clientSoldeMin.nom})`);
  console.log(`   Solde maximum: ${soldeMax.toFixed(2)}€ (${clientSoldeMax.prenom} ${clientSoldeMax.nom})`);
  console.log();
  
  if (clientsSoldeFaible.length > 0) {
    console.log(`⚠️ ALERTES (solde < ${SEUIL_SOLDE_FAIBLE}€)`);
    console.log(`   Nombre de clients: ${clientsSoldeFaible.length}`);
    clientsSoldeFaible.forEach(client => {
      console.log(`   - ${client.prenom} ${client.nom}: ${client.solde.toFixed(2)}€`);
    });
  } else {
    console.log("✅ Aucune alerte (tous les soldes sont suffisants)");
  }
}

// === 7. AJOUTER UN NOUVEAU CLIENT ===

async function ajouterClient(nom, prenom, email, soldeInitial = 0) {
  console.log(`\n➕ Ajout d'un nouveau client: ${prenom} ${nom}`);
  
  try {
    const clients = await chargerClients();
    
    const nouveauId = clients.length > 0 
      ? Math.max(...clients.map(c => c.id)) + 1 
      : 1;
    
    const nouveauClient = {
      id: nouveauId,
      nom,
      prenom,
      solde: soldeInitial,
      email
    };
    
    clients.push(nouveauClient);
    await sauvegarderClients(clients);
    
    console.log(`✅ Client ajouté avec l'ID ${nouveauId}`);
    console.log(`   Solde initial: ${soldeInitial.toFixed(2)}€`);
    
    return nouveauClient;
    
  } catch (erreur) {
    console.error(`❌ Erreur: ${erreur.message}`);
    return null;
  }
}

// === PROGRAMME PRINCIPAL ===

async function main() {
  console.log("=== SYSTÈME DE GESTION DES SOLDES CLIENTS ===\n");
  
  try {
    // Affichage initial
    await afficherSoldes();
    
    // Générer le rapport initial
    await genererRapport();
    
    // Test 1: Recharger un solde
    console.log("\n" + "=".repeat(50));
    await rechargerSolde(1, 25.00);
    
    // Test 2: Retirer un solde
    console.log("\n" + "=".repeat(50));
    await retirerSolde(2, 20.00);
    
    // Test 3: Retrait avec solde insuffisant
    console.log("\n" + "=".repeat(50));
    await retirerSolde(4, 50.00);
    
    // Test 4: Ajouter un nouveau client
    console.log("\n" + "=".repeat(50));
    await ajouterClient("Durand", "Julie", "julie.durand@email.com", 100.00);
    
    // Rapport final
    console.log("\n" + "=".repeat(50));
    await genererRapport();
    
    console.log("\n✅ Tests terminés avec succès !");
    
  } catch (erreur) {
    console.error("\n❌ Erreur fatale:", erreur.message);
    process.exit(1);
  }
}

// Exécution
main();
```

**Points à souligner lors de la correction :**

1. **Gestion du fichier** :
   - Vérifier si le fichier existe
   - Créer un fichier vide si nécessaire
   - Formater le JSON pour la lisibilité

2. **Pattern "Charger-Modifier-Sauvegarder"** :
   - Toujours charger les données fraîches
   - Modifier en mémoire
   - Sauvegarder immédiatement

3. **Validation des données** :
   - Vérifier que le montant est positif
   - Vérifier que le client existe
   - Vérifier que le solde est suffisant

4. **Retours de fonction** :
   - Retourner le nouveau solde en cas de succès
   - Retourner null en cas d'échec
   - Permet au code appelant de réagir

5. **Statistiques** :
   - Utiliser reduce() pour les totaux
   - Utiliser filter() pour les sous-ensembles
   - Math.min/max pour les extrêmes

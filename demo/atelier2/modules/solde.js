import { chargerClients } from "./client.js";

const SEUIL_SOLDE_FAIBLE = 30;

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

export {rechargerSolde, retirerSolde, afficherSoldes, genererRapport}
// === PROGRAMMATION ASYNCHRONE ===

// Fonction utilitaire pour simuler un délai
const attendre = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Base de données simulée
const stockDB = {
  1: { nom: "Souris sans fil", stock: 50 },
  2: { nom: "Clavier mécanique", stock: 5 },
  3: { nom: "Écran 24 pouces", stock: 0 }
};

// === 1. PROMISES DE BASE ===

console.log("=== DÉMONSTRATION PROMISES ===\n");

// Simuler une vérification de stock asynchrone (API, BDD, etc.)
function verifierStockAsync(produitId) {
  return new Promise((resolve, reject) => {
    console.log(`⏳ Vérification du stock pour produit ${produitId}...`);
    
    // Simuler un délai réseau
    setTimeout(() => {
      const stock = Math.floor(Math.random() * 100);
      
      if (stock > 0) {
        resolve({ produitId, stock, statut: "disponible" });
      } else {
        reject(new Error(`Produit ${produitId} en rupture de stock`));
      }
    }, 1000);
  });
}

// === 2. EXEMPLE PRATIQUE : Système de réservation ===

// Simuler une lecture en base de données
async function lireStock(produitId) {
  await attendre(500); // Simuler latence BDD
  
  const produit = stockDB[produitId];
  if (!produit) {
    throw new Error(`Produit ${produitId} inexistant`);
  }
  
  return produit;
}

// Simuler une écriture en base de données
async function ecrireStock(produitId, nouvelleQuantite) {
  await attendre(700); // Simuler latence BDD
  
  if (!stockDB[produitId]) {
    throw new Error(`Produit ${produitId} inexistant`);
  }
  
  stockDB[produitId].stock = nouvelleQuantite;
  return true;
}

// Fonction métier : réserver un produit
async function reserverProduit(produitId, quantiteDemandee) {
  console.log(`\n🛒 Tentative de réservation: ${quantiteDemandee} × produit ${produitId}`);
  
  try {
    // 1. Lire le stock actuel
    console.log("  ⏳ Lecture du stock...");
    const produit = await lireStock(produitId);
    console.log(`  📦 Stock actuel: ${produit.stock} ${produit.nom}`);
    
    // 2. Vérifier la disponibilité
    if (produit.stock < quantiteDemandee) {
      throw new Error(`Stock insuffisant (demandé: ${quantiteDemandee}, disponible: ${produit.stock})`);
    }
    
    // 3. Simuler un traitement (paiement, etc.)
    console.log("  💳 Traitement du paiement...");
    await attendre(1000);
    
    // 4. Mettre à jour le stock
    console.log("  ⏳ Mise à jour du stock...");
    const nouveauStock = produit.stock - quantiteDemandee;
    await ecrireStock(produitId, nouveauStock);
    
    console.log(`  ✅ Réservation réussie ! Nouveau stock: ${nouveauStock}`);
    return {
      succes: true,
      produit: produit.nom,
      quantite: quantiteDemandee,
      stockRestant: nouveauStock
    };
    
  } catch (erreur) {
    console.log(`  ❌ Réservation échouée: ${erreur.message}`);
    return {
      succes: false,
      erreur: erreur.message
    };
  }
}

// Fonction pour traiter plusieurs réservations en parallèle
async function traiterReservations(reservations) {
  console.log("\n=== TRAITEMENT DE RÉSERVATIONS EN PARALLÈLE ===");
  
  const promises = reservations.map(({ produitId, quantite }) => 
    reserverProduit(produitId, quantite)
  );
  
  const resultats = await Promise.allSettled(promises);
  
  console.log("\n📊 Résumé des réservations:");
  resultats.forEach((resultat, index) => {
    if (resultat.status === 'fulfilled' && resultat.value.succes) {
      console.log(`  ✅ Réservation ${index + 1}: ${resultat.value.produit}`);
    } else {
      console.log(`  ❌ Réservation ${index + 1}: Échec`);
    }
  });
}

// === EXÉCUTION DES TESTS ===

async function executerTests() {
  console.log("🚀 Démarrage des tests asynchrones\n");
  console.log("⏰ Début:", new Date().toLocaleTimeString());
  
  // Test 1: Réservation réussie
  await reserverProduit(1, 10);
  
  // Test 2: Réservation échouée (stock insuffisant)
  await reserverProduit(2, 10);
  
  // Test 3: Réservation échouée (rupture de stock)
  await reserverProduit(3, 1);
  
  // Test 4: Réservations multiples
  await traiterReservations([
    { produitId: 1, quantite: 5 },
    { produitId: 2, quantite: 2 },
    { produitId: 3, quantite: 1 }
  ]);
  
  console.log("\n⏰ Fin:", new Date().toLocaleTimeString());
  console.log("🏁 Tous les tests terminés");
}

// Lancer les tests
executerTests().catch(console.error);
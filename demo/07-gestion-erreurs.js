// === GESTION DES ERREURS ===

// === 1. ERREURS PERSONNALISÉES ===

// Classe de base pour nos erreurs métier
class BusinessError extends Error {
    constructor(message, code) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.timestamp = new Date();
    }
  }
  
  // Erreur de stock insuffisant
  class StockInsuffisantError extends BusinessError {
    constructor(produit, demande, disponible) {
      super(
        `Stock insuffisant pour "${produit}" (demandé: ${demande}, disponible: ${disponible})`,
        'STOCK_INSUFFISANT'
      );
      this.produit = produit;
      this.demande = demande;
      this.disponible = disponible;
    }
  }
  
  // Erreur de produit non trouvé
  class ProduitNonTrouveError extends BusinessError {
    constructor(produitId) {
      super(`Produit non trouvé (ID: ${produitId})`, 'PRODUIT_NON_TROUVE');
      this.produitId = produitId;
    }
  }
  
  // Erreur de validation
  class ValidationError extends BusinessError {
    constructor(champ, message) {
      super(`Validation échouée pour "${champ}": ${message}`, 'VALIDATION_ERROR');
      this.champ = champ;
    }
  }
  
  // === 2. FONCTIONS AVEC GESTION D'ERREURS ===
  
  // Base de données simulée
  const produits = [
    { id: 1, nom: "Souris sans fil", stock: 50, prix: 29.99 },
    { id: 2, nom: "Clavier mécanique", stock: 5, prix: 89.99 },
    { id: 3, nom: "Écran 24 pouces", stock: 0, prix: 199.99 }
  ];
  
  // Fonction de validation
  function validerQuantite(quantite) {
    if (typeof quantite !== 'number') {
      throw new ValidationError('quantite', 'Doit être un nombre');
    }
    
    if (!Number.isInteger(quantite)) {
      throw new ValidationError('quantite', 'Doit être un entier');
    }
    
    if (quantite <= 0) {
      throw new ValidationError('quantite', 'Doit être positif');
    }
    
    return true;
  }
  
  // Fonction de validation du prix
  function validerPrix(prix) {
    if (typeof prix !== 'number') {
      throw new ValidationError('prix', 'Doit être un nombre');
    }
    
    if (prix < 0) {
      throw new ValidationError('prix', 'Ne peut pas être négatif');
    }
    
    return true;
  }
  
  // Trouver un produit avec gestion d'erreur
  function trouverProduit(id) {
    const produit = produits.find(p => p.id === id);
    
    if (!produit) {
      throw new ProduitNonTrouveError(id);
    }
    
    return produit;
  }
  
  // Vendre un produit avec gestion complète des erreurs
  function vendreArticle(produitId, quantite) {
    console.log(`\n🛒 Tentative de vente: ${quantite} × produit ${produitId}`);
    
    try {
      // 1. Validation des paramètres
      validerQuantite(quantite);
      
      // 2. Recherche du produit
      const produit = trouverProduit(produitId);
      console.log(`  📦 Produit trouvé: ${produit.nom}`);
      
      // 3. Vérification du stock
      if (produit.stock < quantite) {
        throw new StockInsuffisantError(produit.nom, quantite, produit.stock);
      }
      
      // 4. Mise à jour du stock
      produit.stock -= quantite;
      const montant = produit.prix * quantite;
      
      console.log(`  ✅ Vente réussie !`);
      console.log(`  💰 Montant: ${montant.toFixed(2)}€`);
      console.log(`  📊 Stock restant: ${produit.stock}`);
      
      return {
        succes: true,
        produit: produit.nom,
        quantite,
        montant,
        stockRestant: produit.stock
      };
      
    } catch (erreur) {
      // Gestion spécifique selon le type d'erreur
      if (erreur instanceof ValidationError) {
        console.error(`  ❌ Erreur de validation: ${erreur.message}`);
      } else if (erreur instanceof ProduitNonTrouveError) {
        console.error(`  ❌ Produit inexistant: ${erreur.message}`);
      } else if (erreur instanceof StockInsuffisantError) {
        console.error(`  ❌ Stock insuffisant: ${erreur.message}`);
        console.error(`     Disponible: ${erreur.disponible} unités`);
      } else {
        console.error(`  ❌ Erreur inattendue: ${erreur.message}`);
      }
      
      return {
        succes: false,
        erreur: erreur.message,
        code: erreur.code || 'UNKNOWN_ERROR'
      };
    } finally {
      console.log(`  🏁 Transaction terminée`);
    }
  }
  
  // === 3. GESTION D'ERREURS ASYNC ===
  
  // Simuler une opération asynchrone
  const attendre = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  async function verifierStockAsync(produitId) {
    console.log(`\n⏳ Vérification asynchrone du stock pour produit ${produitId}...`);
    
    try {
      // Simuler un délai réseau
      await attendre(1000);
      
      // Recherche du produit (peut lever une erreur)
      const produit = trouverProduit(produitId);
      
      console.log(`  ✅ Stock vérifié: ${produit.stock} unités de ${produit.nom}`);
      
      return {
        succes: true,
        produit: produit.nom,
        stock: produit.stock
      };
      
    } catch (erreur) {
      console.error(`  ❌ Erreur lors de la vérification: ${erreur.message}`);
      
      // Re-lancer l'erreur pour la propager
      throw erreur;
    } finally {
      console.log(`  🏁 Vérification terminée`);
    }
  }
  
  // Fonction wrapper pour gérer les erreurs async
  async function executerAvecGestionErreur(operation, ...args) {
    try {
      return await operation(...args);
    } catch (erreur) {
      console.error("\n🚨 ERREUR CAPTURÉE PAR LE WRAPPER:");
      console.error(`   Type: ${erreur.name}`);
      console.error(`   Message: ${erreur.message}`);
      console.error(`   Code: ${erreur.code || 'N/A'}`);
      
      // Logger pour le monitoring
      loggerErreur(erreur);
      
      return null;
    }
  }
  
  // Fonction de logging des erreurs
  function loggerErreur(erreur) {
    const log = {
      timestamp: new Date().toISOString(),
      type: erreur.name,
      message: erreur.message,
      code: erreur.code,
      stack: erreur.stack
    };
    
    // En production, envoyer à un service de monitoring
    console.log("\n📝 LOG D'ERREUR:", JSON.stringify(log, null, 2));
  }
  
  // === 4. TESTS COMPLETS ===
  
  console.log("=== TESTS DE GESTION DES ERREURS ===");
  
  // Test 1: Vente réussie
  vendreArticle(1, 10);
  
  // Test 2: Validation échouée (quantité négative)
  vendreArticle(1, -5);
  
  // Test 3: Produit non trouvé
  vendreArticle(999, 1);
  
  // Test 4: Stock insuffisant
  vendreArticle(2, 10);
  
  // Test 5: Validation échouée (type incorrect)
  vendreArticle(1, "cinq");
  
  // === TESTS ASYNCHRONES ===
  
  async function executerTestsAsync() {
    console.log("\n=== TESTS ASYNCHRONES ===");
    
    // Test 1: Vérification réussie
    await executerAvecGestionErreur(verifierStockAsync, 1);
    
    // Test 2: Produit non trouvé (erreur propagée)
    await executerAvecGestionErreur(verifierStockAsync, 999);
    
    // Test 3: Vérifications multiples avec Promise.allSettled
    console.log("\n=== VÉRIFICATIONS MULTIPLES ===");
    const resultats = await Promise.allSettled([
      verifierStockAsync(1),
      verifierStockAsync(2),
      verifierStockAsync(999), // Va échouer
      verifierStockAsync(3)
    ]);
    
    console.log("\n📊 RÉSUMÉ DES VÉRIFICATIONS:");
    resultats.forEach((resultat, index) => {
      if (resultat.status === 'fulfilled') {
        console.log(`  ✅ Vérification ${index + 1}: OK`);
      } else {
        console.log(`  ❌ Vérification ${index + 1}: ${resultat.reason.message}`);
      }
    });
  }
  
  // Exécuter les tests async
  executerTestsAsync().catch(console.error);
  
  // === 5. BONNES PRATIQUES ===
  
  console.log("\n=== BONNES PRATIQUES ===");
  console.log(`
  ✅ DO:
    - Créer des classes d'erreur personnalisées
    - Utiliser try/catch pour les opérations risquées
    - Propager les erreurs avec throw
    - Logger les erreurs pour le monitoring
    - Retourner des objets de résultat structurés
    
  ❌ DON'T:
    - Ne pas ignorer silencieusement les erreurs
    - Ne pas utiliser catch() vide
    - Ne pas masquer les vraies erreurs
    - Ne pas utiliser les erreurs pour le contrôle de flux normal
  `);
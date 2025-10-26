// === GESTION D'INVENTAIRE ===

// Base de données produits (tableau d'objets)
const inventaire = [
    {
      id: 1,
      nom: "Souris sans fil",
      prix: 29.99,
      quantite: 50,
      categorie: "Périphériques",
      seuilAlerte: 20
    },
    {
      id: 2,
      nom: "Clavier mécanique",
      prix: 89.99,
      quantite: 15,
      categorie: "Périphériques",
      seuilAlerte: 10
    },
    {
      id: 3,
      nom: "Écran 24 pouces",
      prix: 199.99,
      quantite: 8,
      categorie: "Moniteurs",
      seuilAlerte: 5
    },
    {
      id: 4,
      nom: "Webcam HD",
      prix: 49.99,
      quantite: 30,
      categorie: "Vidéo",
      seuilAlerte: 15
    },
    {
      id: 5,
      nom: "Casque audio",
      prix: 79.99,
      quantite: 0,
      categorie: "Audio",
      seuilAlerte: 10
    }
  ];
  
  console.log("=== INVENTAIRE COMPLET ===");
  console.log(`Nombre total de produits: ${inventaire.length}`);
  
  // === MÉTHODE MAP : Calculer la valeur de chaque produit ===
  
  const valeursStock = inventaire.map(produit => {
    return {
      nom: produit.nom,
      valeur: produit.prix * produit.quantite
    };
  });
  
  console.log("\n=== VALEUR PAR PRODUIT ===");
  valeursStock.forEach(item => {
    console.log(`${item.nom}: ${item.valeur.toFixed(2)}€`);
  });
  
  // === MÉTHODE FILTER : Produits en alerte ===
  
  const produitsEnAlerte = inventaire.filter(produit => {
    return produit.quantite < produit.seuilAlerte;
  });
  
  console.log("\n=== PRODUITS EN ALERTE ===");
  if (produitsEnAlerte.length === 0) {
    console.log("✅ Aucune alerte");
  } else {
    produitsEnAlerte.forEach(produit => {
      if (produit.quantite === 0) {
        console.log(`⚠️ ${produit.nom}: RUPTURE DE STOCK`);
      } else {
        console.log(`⚠️ ${produit.nom}: ${produit.quantite} unités (seuil: ${produit.seuilAlerte})`);
      }
    });
  }
  
  // === MÉTHODE FIND : Rechercher un produit par ID ===
  
  function rechercherProduit(id) {
    const produit = inventaire.find(p => p.id === id);
    
    if (produit) {
      console.log("\n=== PRODUIT TROUVÉ ===");
      console.log(`ID: ${produit.id}`);
      console.log(`Nom: ${produit.nom}`);
      console.log(`Prix: ${produit.prix}€`);
      console.log(`Stock: ${produit.quantite}`);
      console.log(`Catégorie: ${produit.categorie}`);
    } else {
      console.log(`\n❌ Aucun produit avec l'ID ${id}`);
    }
    
    return produit;
  }
  
  rechercherProduit(2);
  rechercherProduit(99);
  
  // === MÉTHODE REDUCE : Valeur totale du stock ===
  
  const valeurTotale = inventaire.reduce((total, produit) => {
    return total + (produit.prix * produit.quantite);
  }, 0);
  
  console.log(`\n=== STATISTIQUES ===`);
  console.log(`Valeur totale du stock: ${valeurTotale.toFixed(2)}€`);
  
  // === MÉTHODE REDUCE : Grouper par catégorie ===
  
  const parCategorie = inventaire.reduce((acc, produit) => {
    const cat = produit.categorie;
    
    if (!acc[cat]) {
      acc[cat] = [];
    }
    
    acc[cat].push(produit.nom);
    return acc;
  }, {});
  
  console.log("\n=== PRODUITS PAR CATÉGORIE ===");
  for (const categorie in parCategorie) {
    console.log(`${categorie}:`);
    parCategorie[categorie].forEach(nom => {
      console.log(`  - ${nom}`);
    });
  }
  
  // === FONCTIONS UTILITAIRES ===
  
  function ajouterProduit(nouveauProduit) {
    inventaire.push(nouveauProduit);
    console.log(`✅ Produit ajouté: ${nouveauProduit.nom}`);
  }
  
  function mettreAJourStock(id, nouvelleQuantite) {
    const produit = inventaire.find(p => p.id === id);
    
    if (produit) {
      const ancienneQuantite = produit.quantite;
      produit.quantite = nouvelleQuantite;
      console.log(`✅ Stock mis à jour pour ${produit.nom}: ${ancienneQuantite} → ${nouvelleQuantite}`);
    } else {
      console.log(`❌ Produit non trouvé (ID: ${id})`);
    }
  }
  
  function supprimerProduit(id) {
    const index = inventaire.findIndex(p => p.id === id);
    
    if (index !== -1) {
      const produitSupprime = inventaire.splice(index, 1)[0];
      console.log(`✅ Produit supprimé: ${produitSupprime.nom}`);
    } else {
      console.log(`❌ Produit non trouvé (ID: ${id})`);
    }
  }
  
  // Test des fonctions
  console.log("\n=== TESTS DES FONCTIONS ===");
  mettreAJourStock(3, 25);
  ajouterProduit({
    id: 6,
    nom: "Micro USB",
    prix: 39.99,
    quantite: 40,
    categorie: "Audio",
    seuilAlerte: 15
  });
  
  // Tri des produits par prix
  const produitsOrdonnes = [...inventaire].sort((a, b) => a.prix - b.prix);
  
  console.log("\n=== PRODUITS PAR PRIX CROISSANT ===");
  produitsOrdonnes.forEach(p => {
    console.log(`${p.nom}: ${p.prix}€`);
  });
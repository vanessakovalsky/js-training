// === GESTION DE STOCK AVEC SYNTAXE MODERNE ===

// Données de base
const inventaire = [
    { id: 1, nom: "Souris sans fil", prix: 29.99, quantite: 50, categorie: "Périphériques" },
    { id: 2, nom: "Clavier mécanique", prix: 89.99, quantite: 15, categorie: "Périphériques" },
    { id: 3, nom: "Écran 24 pouces", prix: 199.99, quantite: 8, categorie: "Moniteurs" }
  ];
  
  // === ARROW FUNCTIONS ===
  
  // Calculer la valeur du stock avec arrow function
  const calculerValeur = produit => produit.prix * produit.quantite;
  
  // Avec destructuring dans les paramètres
  const calculerValeurDest = ({ prix, quantite }) => prix * quantite;
  
  // Afficher avec template literals
  const afficherProduit = ({ id, nom, prix, quantite }) => {
    const valeur = prix * quantite;
    console.log(`[${id}] ${nom} - ${quantite} unités @ ${prix}€ = ${valeur.toFixed(2)}€`);
  };
  
  console.log("=== INVENTAIRE ===");
  inventaire.forEach(afficherProduit);
  
  // === DESTRUCTURING ===
  
  // Extraire des propriétés spécifiques
  const [premierProduit, deuxiemeProduit, ...autresProduits] = inventaire;
  console.log("\nPremier produit:", premierProduit.nom);
  console.log("Autres produits:", autresProduits.length);
  
  // Destructuring dans une fonction
  const afficherResume = ({ nom, quantite, categorie = "Non classé" }) => {
    console.log(`${nom} (${categorie}): ${quantite} en stock`);
  };
  
  // === SPREAD OPERATOR ===
  
  // Créer une copie pour modification
  const ajouterRemise = (produit, remise) => ({
    ...produit,
    prixOriginal: produit.prix,
    prix: produit.prix * (1 - remise),
    enPromo: true
  });
  
  console.log("\n=== PRODUITS EN PROMOTION ===");
  const produitsPromo = inventaire.map(p => ajouterRemise(p, 0.1));
  produitsPromo.forEach(({ nom, prixOriginal, prix }) => {
    console.log(`${nom}: ${prixOriginal}€ → ${prix.toFixed(2)}€`);
  });
  
  // Fusionner des inventaires
  const nouveauxProduits = [
    { id: 4, nom: "Webcam HD", prix: 49.99, quantite: 30, categorie: "Vidéo" }
  ];
  
  const inventaireComplet = [...inventaire, ...nouveauxProduits];
  console.log(`\nInventaire complet: ${inventaireComplet.length} produits`);
  
  // === DEFAULT PARAMETERS ===
  
  // Fonction avec paramètres par défaut
  const creerMouvementStock = (
    produitId, 
    quantite, 
    type = "ENTREE", 
    date = new Date()
  ) => ({
    produitId,
    quantite,
    type,
    date: date.toISOString().split('T')[0]
  });
  
  console.log("\n=== MOUVEMENTS DE STOCK ===");
  console.log(creerMouvementStock(1, 50));
  console.log(creerMouvementStock(2, -10, "SORTIE"));
  
  // === OPTIONAL CHAINING ===
  
  const produitTest = {
    nom: "Test",
    details: {
      fournisseur: {
        nom: "Fournisseur A"
      }
    }
  };
  
  // Avec optional chaining (sûr)
  const fournisseur = produitTest.details?.fournisseur?.nom;
  const inexistant = produitTest.autre?.propriete?.profonde;
  console.log("\nFournisseur:", fournisseur);
  console.log("Inexistant:", inexistant); // undefined, pas d'erreur
  
  // === NULLISH COALESCING ===
  
  const quantiteParDefaut = 0;
  const quantiteNulle = null;
  
  console.log("\n=== GESTION DES VALEURS PAR DÉFAUT ===");
  console.log("Avec ||:", quantiteParDefaut || 100); // 100 (mauvais!)
  console.log("Avec ??:", quantiteParDefaut ?? 100); // 0 (bon!)
  console.log("Null ??:", quantiteNulle ?? 100); // 100
  
  // === MÉTHODES CHAÎNÉES ===
  
  // Exemple complet de chaînage moderne
  const rapportStock = inventaire
    .filter(({ quantite }) => quantite < 20)
    .map(({ nom, quantite, prix }) => ({
      nom,
      quantite,
      valeur: quantite * prix,
      statut: quantite === 0 ? "RUPTURE" : "FAIBLE"
    }))
    .sort((a, b) => a.quantite - b.quantite);
  
  console.log("\n=== PRODUITS À SURVEILLER ===");
  rapportStock.forEach(({ nom, quantite, valeur, statut }) => {
    console.log(`${statut}: ${nom} - ${quantite} unités (${valeur.toFixed(2)}€)`);
  });
  
  // === OBJECT SHORTHAND ===
  
  const creerProduit = (nom, prix, quantite) => {
    // Avec shorthand (même nom de propriété et variable)
    return { nom, prix, quantite };
  };
  
  const nouveauProduit = creerProduit("Micro USB", 39.99, 25);
  console.log("\nNouveau produit:", nouveauProduit);
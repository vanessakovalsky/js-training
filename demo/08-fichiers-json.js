// === MANIPULATION DE FICHIERS JSON ===

import fs from 'fs/promises';

const FICHIER_STOCK = 'stock.json';

// === 1. CHARGER LES DONNÉES ===

async function chargerStock() {
  try {
    console.log("📂 Chargement du stock depuis", FICHIER_STOCK);
    const data = await fs.readFile(FICHIER_STOCK, 'utf-8');
    const stock = JSON.parse(data);
    console.log(`✅ ${stock.length} produits chargés`);
    return stock;
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      console.log("⚠️ Fichier non trouvé, création d'un stock vide");
      return [];
    }
    throw erreur;
  }
}

// === 2. SAUVEGARDER LES DONNÉES ===

async function sauvegarderStock(stock) {
  try {
    console.log("💾 Sauvegarde du stock...");
    const json = JSON.stringify(stock, null, 2);
    await fs.writeFile(FICHIER_STOCK, json, 'utf-8');
    console.log(`✅ ${stock.length} produits sauvegardés`);
    return true;
  } catch (erreur) {
    console.error("❌ Erreur lors de la sauvegarde:", erreur.message);
    return false;
  }
}

// === 3. OPÉRATIONS SUR LE STOCK ===

async function ajouterProduit(nom, prix, quantite, categorie) {
  const stock = await chargerStock();
  
  const nouveauId = stock.length > 0 
    ? Math.max(...stock.map(p => p.id)) + 1 
    : 1;
  
  const nouveauProduit = {
    id: nouveauId,
    nom,
    prix,
    quantite,
    categorie
  };
  
  stock.push(nouveauProduit);
  await sauvegarderStock(stock);
  
  console.log(`✅ Produit ajouté: ${nom} (ID: ${nouveauId})`);
  return nouveauProduit;
}

async function mettreAJourQuantite(id, nouvelleQuantite) {
  const stock = await chargerStock();
  const produit = stock.find(p => p.id === id);
  
  if (!produit) {
    console.log(`❌ Produit ${id} non trouvé`);
    return false;
  }
  
  const ancienneQuantite = produit.quantite;
  produit.quantite = nouvelleQuantite;
  
  await sauvegarderStock(stock);
  console.log(`✅ Quantité mise à jour: ${produit.nom} (${ancienneQuantite} → ${nouvelleQuantite})`);
  return true;
}

async function afficherStock() {
  const stock = await chargerStock();
  
  console.log("\n=== STOCK ACTUEL ===");
  stock.forEach(({ id, nom, quantite, prix, categorie }) => {
    const valeur = (quantite * prix).toFixed(2);
    console.log(`[${id}] ${nom} - ${quantite} unités @ ${prix}€ = ${valeur}€`);
    console.log(`    Catégorie: ${categorie}`);
  });
  
  const valeurTotale = stock.reduce((total, p) => total + (p.prix * p.quantite), 0);
  console.log(`\n💰 Valeur totale du stock: ${valeurTotale.toFixed(2)}€`);
}

// === 4. EXÉCUTION DES TESTS ===

async function main() {
  console.log("=== GESTION DE STOCK AVEC FICHIERS JSON ===\n");
  
  // Afficher le stock initial
  await afficherStock();
  
  // Ajouter un produit
  console.log("\n=== AJOUT D'UN PRODUIT ===");
  await ajouterProduit("Webcam HD", 49.99, 30, "Vidéo");
  
  // Mettre à jour une quantité
  console.log("\n=== MISE À JOUR ===");
  await mettreAJourQuantite(1, 45);
  
  // Afficher le stock final
  await afficherStock();
}

main().catch(console.error);
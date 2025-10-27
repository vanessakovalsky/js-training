// === SERVICE DE GESTION DE STOCK ===

import { lireStock, sauvegarderStock } from './fileManager.js';

/**
 * Obtenir tous les produits
 */
export async function obtenirTousProduits() {
  return await lireStock();
}

/**
 * Trouver un produit par ID
 */
export async function trouverProduit(id) {
  const stock = await lireStock();
  return stock.find(p => p.id === id);
}

/**
 * Ajouter un produit
 */
export async function ajouterProduit(nom, prix, quantite) {
  const stock = await lireStock();
  
  // Générer un nouvel ID
  const nouvelId = stock.length > 0 
    ? Math.max(...stock.map(p => p.id)) + 1 
    : 1;
  
  const nouveauProduit = {
    id: nouvelId,
    nom,
    prix,
    quantite
  };
  
  stock.push(nouveauProduit);
  await sauvegarderStock(stock);
  
  console.log(`✅ Produit ajouté: ${nom} (ID: ${nouvelId})`);
  return nouveauProduit;
}

/**
 * Mettre à jour le stock d'un produit
 */
export async function mettreAJourStock(id, nouvelleQuantite) {
  const stock = await lireStock();
  const produit = stock.find(p => p.id === id);
  
  if (!produit) {
    throw new Error(`Produit ${id} non trouvé`);
  }
  
  const ancienneQuantite = produit.quantite;
  produit.quantite = nouvelleQuantite;
  
  await sauvegarderStock(stock);
  
  console.log(`✅ Stock mis à jour pour ${produit.nom}: ${ancienneQuantite} → ${nouvelleQuantite}`);
  return produit;
}

/**
 * Supprimer un produit
 */
export async function supprimerProduit(id) {
  const stock = await lireStock();
  const index = stock.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error(`Produit ${id} non trouvé`);
  }
  
  const produitSupprime = stock.splice(index, 1)[0];
  await sauvegarderStock(stock);
  
  console.log(`✅ Produit supprimé: ${produitSupprime.nom}`);
  return produitSupprime;
}

/**
 * Calculer la valeur totale du stock
 */
export async function calculerValeurTotale() {
  const stock = await lireStock();
  return stock.reduce((total, p) => total + (p.prix * p.quantite), 0);
}

/**
 * Afficher un rapport du stock
 */
export async function afficherRapport() {
  const stock = await lireStock();
  const valeurTotale = await calculerValeurTotale();
  
  console.log("\n=== RAPPORT DE STOCK ===");
  console.log(`Nombre de produits: ${stock.length}`);
  console.log(`Valeur totale: ${valeurTotale.toFixed(2)}€\n`);
  
  stock.forEach(p => {
    const valeur = p.prix * p.quantite;
    const statut = p.quantite < 10 ? "⚠️" : "✅";
    console.log(`${statut} [${p.id}] ${p.nom}`);
    console.log(`   Prix: ${p.prix}€ | Stock: ${p.quantite} | Valeur: ${valeur.toFixed(2)}€`);
  });
}
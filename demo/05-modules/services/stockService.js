// === SERVICE DE GESTION DE STOCK ===

import Produit, { SEUIL_ALERTE, CATEGORIES } from '../models/Produit.js';
import { formaterPrix, creerMessageStatut } from '../utils/format.js';

// Base de données simulée
let inventaire = [];
let prochainId = 1;

// Ajouter un produit
export const ajouterProduit = (nom, prix, quantite, categorie) => {
  const produit = new Produit(prochainId++, nom, prix, quantite, categorie);
  inventaire.push(produit);
  console.log(`✅ Produit ajouté: ${produit.toString()}`);
  return produit;
};

// Obtenir tous les produits
export const obtenirTousProduits = () => {
  return [...inventaire]; // Copie pour éviter modifications externes
};

// Trouver un produit par ID
export const trouverProduit = (id) => {
  return inventaire.find(p => p.id === id);
};

// Mettre à jour le stock
export const mettreAJourStock = (id, nouvelleQuantite) => {
  const produit = trouverProduit(id);
  
  if (!produit) {
    console.log(`❌ Produit non trouvé (ID: ${id})`);
    return false;
  }
  
  const ancienneQuantite = produit.quantite;
  produit.quantite = nouvelleQuantite;
  console.log(`✅ Stock mis à jour pour ${produit.nom}: ${ancienneQuantite} → ${nouvelleQuantite}`);
  return true;
};

// Ajouter au stock
export const ajouterStock = (id, quantite) => {
  const produit = trouverProduit(id);
  
  if (!produit) {
    console.log(`❌ Produit non trouvé (ID: ${id})`);
    return false;
  }
  
  produit.quantite += quantite;
  console.log(`✅ ${quantite} unités ajoutées à ${produit.nom} (nouveau stock: ${produit.quantite})`);
  return true;
};

// Retirer du stock
export const retirerStock = (id, quantite) => {
  const produit = trouverProduit(id);
  
  if (!produit) {
    console.log(`❌ Produit non trouvé (ID: ${id})`);
    return false;
  }
  
  if (produit.quantite < quantite) {
    console.log(`❌ Stock insuffisant pour ${produit.nom} (demandé: ${quantite}, disponible: ${produit.quantite})`);
    return false;
  }
  
  produit.quantite -= quantite;
  console.log(`✅ ${quantite} unités retirées de ${produit.nom} (nouveau stock: ${produit.quantite})`);
  return true;
};

// Obtenir les produits en alerte
export const obtenirProduitsEnAlerte = () => {
  return inventaire.filter(p => p.quantite < SEUIL_ALERTE);
};

// Calculer la valeur totale du stock
export const calculerValeurTotale = () => {
  return inventaire.reduce((total, produit) => total + produit.getValeur(), 0);
};

// Générer un rapport
export const genererRapport = () => {
  console.log("\n=== RAPPORT DE STOCK ===");
  console.log(`Nombre de produits: ${inventaire.length}`);
  console.log(`Valeur totale: ${formaterPrix(calculerValeurTotale())}`);
  
  console.log("\n=== DÉTAILS PAR PRODUIT ===");
  inventaire.forEach(produit => {
    const statut = creerMessageStatut(produit.quantite, SEUIL_ALERTE);
    const valeur = formaterPrix(produit.getValeur());
    console.log(`${statut} [${produit.id}] ${produit.nom} - ${produit.quantite} unités = ${valeur}`);
  });
  
  const produitsEnAlerte = obtenirProduitsEnAlerte();
  if (produitsEnAlerte.length > 0) {
    console.log("\n=== ALERTES ===");
    produitsEnAlerte.forEach(p => {
      console.log(`⚠️ ${p.nom}: ${p.quantite} unités`);
    });
  }
};

// Réinitialiser l'inventaire
export const reinitialiser = () => {
  inventaire = [];
  prochainId = 1;
  console.log("✅ Inventaire réinitialisé");
};
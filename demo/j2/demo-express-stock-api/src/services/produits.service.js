// === SERVICE DE GESTION DES PRODUITS ===

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STOCK_FILE = path.join(__dirname, '../../data/stock.json');

/**
 * Lire le stock
 */
export async function lireStock() {
  try {
    const data = await fs.readFile(STOCK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      // Créer le dossier et le fichier
      await fs.mkdir(path.dirname(STOCK_FILE), { recursive: true });
      await fs.writeFile(STOCK_FILE, '[]', 'utf-8');
      return [];
    }
    throw erreur;
  }
}

/**
 * Sauvegarder le stock
 */
export async function sauvegarderStock(stock) {
  await fs.writeFile(STOCK_FILE, JSON.stringify(stock, null, 2), 'utf-8');
}

/**
 * Obtenir tous les produits
 */
export async function obtenirTous() {
  return await lireStock();
}

/**
 * Obtenir un produit par ID
 */
export async function obtenirParId(id) {
  const stock = await lireStock();
  return stock.find(p => p.id === id);
}

/**
 * Créer un produit
 */
export async function creer(donnees) {
  const stock = await lireStock();
  
  const nouvelId = stock.length > 0 
    ? Math.max(...stock.map(p => p.id)) + 1 
    : 1;
  
  const nouveauProduit = {
    id: nouvelId,
    ...donnees,
    createdAt: new Date().toISOString()
  };
  
  stock.push(nouveauProduit);
  await sauvegarderStock(stock);
  
  return nouveauProduit;
}

/**
 * Mettre à jour un produit
 */
export async function mettreAJour(id, donnees) {
  const stock = await lireStock();
  const index = stock.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  stock[index] = {
    ...stock[index],
    ...donnees,
    id, // Préserver l'ID
    updatedAt: new Date().toISOString()
  };
  
  await sauvegarderStock(stock);
  return stock[index];
}

/**
 * Supprimer un produit
 */
export async function supprimer(id) {
  const stock = await lireStock();
  const index = stock.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const produitSupprime = stock.splice(index, 1)[0];
  await sauvegarderStock(stock);
  
  return produitSupprime;
}
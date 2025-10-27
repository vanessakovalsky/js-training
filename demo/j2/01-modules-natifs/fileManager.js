// === GESTIONNAIRE DE FICHIERS ===

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir __dirname en mode ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier de données
const DATA_PATH = path.join(__dirname, 'data', 'stock.json');

/**
 * Lire le stock depuis le fichier JSON
 */
export async function lireStock() {
  try {
    console.log("📂 Lecture du stock depuis:", DATA_PATH);
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    const stock = JSON.parse(data);
    console.log(`✅ ${stock.length} produits chargés`);
    return stock;
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      console.log("⚠️ Fichier non trouvé, création d'un stock vide");
      
      // Créer le dossier data s'il n'existe pas
      const dataDir = path.dirname(DATA_PATH);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Créer un fichier vide
      await fs.writeFile(DATA_PATH, '[]', 'utf-8');
      return [];
    }
    throw erreur;
  }
}

/**
 * Sauvegarder le stock dans le fichier JSON
 */
export async function sauvegarderStock(stock) {
  try {
    console.log("💾 Sauvegarde du stock...");
    const json = JSON.stringify(stock, null, 2);
    await fs.writeFile(DATA_PATH, json, 'utf-8');
    console.log(`✅ ${stock.length} produits sauvegardés`);
    return true;
  } catch (erreur) {
    console.error("❌ Erreur lors de la sauvegarde:", erreur.message);
    return false;
  }
}

/**
 * Vérifier si le fichier existe
 */
export async function fichierExiste() {
  try {
    await fs.access(DATA_PATH);
    return true;
  } catch {
    return false;
  }
}

/**
 * Créer une sauvegarde du stock
 */
export async function creerSauvegarde() {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(
    __dirname,
    'data',
    `stock-backup-${timestamp}.json`
  );
  
  try {
    const stock = await lireStock();
    await fs.writeFile(backupPath, JSON.stringify(stock, null, 2), 'utf-8');
    console.log(`✅ Sauvegarde créée: ${path.basename(backupPath)}`);
    return backupPath;
  } catch (erreur) {
    console.error("❌ Erreur lors de la sauvegarde:", erreur.message);
    return null;
  }
}

/**
 * Lister toutes les sauvegardes
 */
export async function listerSauvegardes() {
  try {
    const dataDir = path.dirname(DATA_PATH);
    const fichiers = await fs.readdir(dataDir);
    
    const sauvegardes = fichiers
      .filter(f => f.startsWith('stock-backup-'))
      .sort()
      .reverse();
    
    return sauvegardes;
  } catch (erreur) {
    console.error("❌ Erreur lors du listage:", erreur.message);
    return [];
  }
}
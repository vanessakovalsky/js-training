// === APPLICATION PRINCIPALE ===

import * as stockService from './stockService.js';
import * as fileManager from './fileManager.js';

async function main() {
  console.log("=== SYSTÈME DE GESTION DE STOCK ===\n");
  
  try {
    // Vérifier si le fichier existe
    const existe = await fileManager.fichierExiste();
    console.log(`Fichier de données: ${existe ? '✅ Existant' : '⚠️ Sera créé'}\n`);
    
    // Afficher le rapport initial
    await stockService.afficherRapport();
    
    // Ajouter un produit
    console.log("\n=== AJOUT D'UN PRODUIT ===");
    await stockService.ajouterProduit("Écran 27 pouces", 299.99, 8);
    
    // Mettre à jour un stock
    console.log("\n=== MISE À JOUR DU STOCK ===");
    await stockService.mettreAJourStock(1, 45);
    
    // Créer une sauvegarde
    console.log("\n=== SAUVEGARDE ===");
    await fileManager.creerSauvegarde();
    
    // Lister les sauvegardes
    const sauvegardes = await fileManager.listerSauvegardes();
    console.log("\nSauvegardes disponibles:");
    sauvegardes.forEach(s => console.log(`  - ${s}`));
    
    // Rapport final
    await stockService.afficherRapport();
    
  } catch (erreur) {
    console.error("\n❌ Erreur:", erreur.message);
    process.exit(1);
  }
}

main();
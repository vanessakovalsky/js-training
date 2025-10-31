import { afficherSoldes, genererRapport, rechargerSolde, retirerSolde } from "./modules/solde.js";
import { ajouterClient } from "./modules/client.js";

// === PROGRAMME PRINCIPAL ===

async function main() {
  console.log("=== SYSTÈME DE GESTION DES SOLDES CLIENTS ===\n");
  
  try {
    // Affichage initial
    await afficherSoldes();
    
    // Générer le rapport initial
    await genererRapport();
    
    // Test 1: Recharger un solde
    console.log("\n" + "=".repeat(50));
    await rechargerSolde(1, 25.00);
    
    // Test 2: Retirer un solde
    console.log("\n" + "=".repeat(50));
    await retirerSolde(2, 20.00);
    
    // Test 3: Retrait avec solde insuffisant
    console.log("\n" + "=".repeat(50));
    await retirerSolde(4, 50.00);
    
    // Test 4: Ajouter un nouveau client
    console.log("\n" + "=".repeat(50));
    await ajouterClient("Durand", "Julie", "julie.durand@email.com", 100.00);
    
    // Rapport final
    console.log("\n" + "=".repeat(50));
    await genererRapport();
    
    console.log("\n✅ Tests terminés avec succès !");
    
  } catch (erreur) {
    console.error("\n❌ Erreur fatale:", erreur.message);
    process.exit(1);
  }
}

// Exécution
main();
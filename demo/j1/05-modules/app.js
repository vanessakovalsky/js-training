// === APPLICATION PRINCIPALE ===

import Produit, { CATEGORIES } from './models/Produit.js';
import * as stockService from './services/stockService.js';
import format from './utils/format.js';

console.log("=== GESTION DE STOCK - DÉMO MODULES ===\n");

// Ajouter des produits
stockService.ajouterProduit("Souris sans fil", 29.99, 50, CATEGORIES.PERIPHERIQUES);
stockService.ajouterProduit("Clavier mécanique", 89.99, 15, CATEGORIES.PERIPHERIQUES);
stockService.ajouterProduit("Écran 24 pouces", 199.99, 5, CATEGORIES.MONITEURS);
stockService.ajouterProduit("Webcam HD", 49.99, 0, CATEGORIES.VIDEO);

// Afficher le rapport initial
stockService.genererRapport();

// Opérations de stock
console.log("\n=== OPÉRATIONS ===");
stockService.ajouterStock(1, 20);
stockService.retirerStock(2, 5);
stockService.retirerStock(3, 10); // Devrait échouer

// Rapport final
stockService.genererRapport();

// Test des utilitaires de formatage
console.log("\n=== TESTS DE FORMATAGE ===");
console.log("Prix:", format.formaterPrix(1234.5));
console.log("Date:", format.formaterDate());
console.log("Pourcentage:", format.formaterPourcentage(0.156));
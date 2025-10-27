// Déclaration de produits en stock
const nomProduit = "Souris sans fil";
const prixUnitaire = 29.98;
let quantiteStock = 100;
const seuilAlerte = 20;

console.log('=== GESTION DE STOCK ===');
console.log('Produit', nomProduit);
console.log('Prix', prixUnitaire, '€');
console.log("Quantité en stock", quantiteStock);

//Simulation d'une vente
const quantiteVendue = 15;
quantiteStock = quantiteStock - quantiteVendue;

console.log("\n===APRES VENTE ===");
console.log("Quantite vendue", quantiteVendue);
console.log("Quantité en stock", quantiteStock);

// Vérification du stock
const stockFaible = quantiteStock < seuilAlerte;
console.log("Stock faible?", stockFaible);

// Calcul du chiffre d'affaires
const chiffreAffaires = quantiteVendue * prixUnitaire;
console.log("Chiffre d'affaire", chiffreAffaires);

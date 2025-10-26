// === SYSTÈME D'ALERTES DE STOCK ===

// Fonction pour vérifier le niveau de stock
function verifierStock(nomProduit, quantite, seuilAlerte) {
    console.log(`\n--- ${nomProduit} ---`);
    console.log(`Stock actuel: ${quantite}`);
    
    if (quantite === 0) {
      console.log("⚠️ ALERTE: Rupture de stock !");
      return "RUPTURE";
    } else if (quantite < seuilAlerte) {
      console.log("⚠️ ALERTE: Stock faible, réapprovisionner");
      return "FAIBLE";
    } else {
      console.log("✅ Stock suffisant");
      return "OK";
    }
  }
  
  // Test avec plusieurs produits
  const produit1 = verifierStock("Souris sans fil", 5, 20);
  const produit2 = verifierStock("Clavier", 0, 15);
  const produit3 = verifierStock("Écran", 45, 10);
  
  // === SIMULATION DE VENTES SUCCESSIVES ===
  
  function simulerVentes(stockInitial, nombreVentes) {
    let stockActuel = stockInitial;
    
    console.log("\n=== SIMULATION DE VENTES ===");
    console.log(`Stock initial: ${stockActuel}`);
    
    for (let i = 1; i <= nombreVentes; i++) {
      const quantiteVente = Math.floor(Math.random() * 5) + 1; // 1 à 5
      
      if (stockActuel >= quantiteVente) {
        stockActuel -= quantiteVente;
        console.log(`Vente ${i}: -${quantiteVente} unités → Stock: ${stockActuel}`);
      } else {
        console.log(`Vente ${i}: ⚠️ Stock insuffisant (demandé: ${quantiteVente}, disponible: ${stockActuel})`);
      }
    }
    
    return stockActuel;
  }
  
  const stockFinal = simulerVentes(50, 10);
  console.log(`\nStock final après simulation: ${stockFinal}`);
  
  // === CALCUL DE VALEUR DU STOCK ===
  
  function calculerValeurStock(produits) {
    let valeurTotale = 0;
    
    console.log("\n=== VALEUR DU STOCK ===");
    
    for (let i = 0; i < produits.length; i++) {
      const valeur = produits[i].prix * produits[i].quantite;
      valeurTotale += valeur;
      console.log(`${produits[i].nom}: ${valeur}€`);
    }
    
    return valeurTotale;
  }
  
  // Exemple d'utilisation
  const inventaire = [
    { nom: "Souris", prix: 29.99, quantite: 50 },
    { nom: "Clavier", prix: 79.99, quantite: 30 },
    { nom: "Écran", prix: 199.99, quantite: 15 }
  ];
  
  const valeurTotale = calculerValeurStock(inventaire);
  console.log(`\nValeur totale du stock: ${valeurTotale.toFixed(2)}€`);
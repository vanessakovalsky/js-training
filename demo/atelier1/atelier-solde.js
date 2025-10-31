// === GESTION DES SOLDES CLIENTS ===

// Base de données clients
const clients = [
    { id: 1, nom: "Dupont", prenom: "Martin", solde: 50.00 },
    { id: 2, nom: "Bernard", prenom: "Sophie", solde: 75.50 },
    { id: 3, nom: "Petit", prenom: "Lucas", solde: 120.00 },
    { id: 4, nom: "Moreau", prenom: "Emma", solde: 30.00 },
    { id: 5, nom: "Laurent", prenom: "Thomas", solde: 50.00 }
  ];
  
  // Fonction pour ajouter du solde
  function ajouterSolde(clientId, montant) {
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      console.log(`❌ Client non trouvé (ID: ${clientId})`);
      return false;
    }
    
    client.solde += montant;
    console.log(`✅ ${montant.toFixed(2)}€ ajoutés au compte de ${client.prenom} ${client.nom} (nouveau solde: ${client.solde.toFixed(2)}€)`);
    return true;
  }
  
  // Fonction pour retirer du solde
  function retirerSolde(clientId, montant) {
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      console.log(`❌ Client non trouvé (ID: ${clientId})`);
      return false;
    }
    
    if (client.solde < montant) {
      console.log(`❌ Solde insuffisant pour ${client.prenom} ${client.nom} (demandé: ${montant}€, disponible: ${client.solde.toFixed(2)}€)`);
      return false;
    }
    
    client.solde -= montant;
    console.log(`✅ ${montant.toFixed(2)}€ retirés du compte de ${client.prenom} ${client.nom} (nouveau solde: ${client.solde.toFixed(2)}€)`);
    return true;
  }
  
  // Fonction pour afficher tous les soldes
  function afficherSoldes() {
    console.log("\n=== SOLDES CLIENTS ===");
    
    for (let compteur = 1; compteur < clients.length; compteur++){
        
    }

    clients.map(client => {
        console.log(client.id, client.nom, client.prenom)
    }

    )

    clients.forEach(client => {
      console.log(`${client.id}. ${client.prenom} ${client.nom}: ${client.solde.toFixed(2)}€`);
    });
    
    const soldeTotal = clients.reduce((total, client) => total + client.solde, 0);
    console.log(`\nSolde total: ${soldeTotal.toFixed(2)}€`);
    console.log(`Nombre de clients: ${clients.length}`);
    console.log(`Solde moyen: ${(soldeTotal / clients.length).toFixed(2)}€`);
  }
  
  // === TESTS ===
  
  afficherSoldes();
  
  console.log("\n=== OPÉRATIONS ===");
  ajouterSolde(1, 20.00);
  ajouterSolde(2, 50.00);
  retirerSolde(2, 100.00);  // Devrait échouer
  retirerSolde(3, 50.00);   // Devrait réussir
  ajouterSolde(99, 10.00);  // Client inexistant
  
  afficherSoldes();
  
  // Bonus : Clients avec solde faible
  console.log("\n=== CLIENTS AVEC SOLDE FAIBLE (<50€) ===");
  const clientsSoldeFaible = clients.filter(c => c.solde < 50);
  clientsSoldeFaible.forEach(c => {
    console.log(`⚠️ ${c.prenom} ${c.nom}: ${c.solde.toFixed(2)}€`);
  });
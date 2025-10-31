import fs from 'fs/promises';

const FICHIER_CLIENTS = 'clients.json';

async function obtenirInformationClient(id){
  const data = await fs.readFile(FICHIER_CLIENTS, 'utf-8');
  const clients = JSON.parse(data);
  const clientSpecifique = clients.find( (client) => id == client.id);
  console.log(clientSpecifique);
  return clientSpecifique;
}

async function chargerClients() {
    try {
      console.log("📂 Chargement des clients depuis", FICHIER_CLIENTS);
      const data = await fs.readFile(FICHIER_CLIENTS, 'utf-8');
      const clients = JSON.parse(data);
      console.log(`✅ ${clients.length} clients chargés\n`);
      return clients;
    } catch (erreur) {
      if (erreur.code === 'ENOENT') {
        console.log("⚠️ Fichier non trouvé, création d'une base vide\n");
        return [];
      }
      console.error("❌ Erreur lors du chargement:", erreur.message);
      throw erreur;
    }
  }
  
  // === 2. SAUVEGARDER LES CLIENTS ===
  
  async function sauvegarderClients(clients) {
    try {
      const json = JSON.stringify(clients, null, 2);
      await fs.writeFile(FICHIER_CLIENTS, json, 'utf-8');
      return true;
    } catch (erreur) {
      console.error("❌ Erreur lors de la sauvegarde:", erreur.message);
      return false;
    }
  }

  async function ajouterClient(nom, prenom, email, soldeInitial = 0) {
    console.log(`\n➕ Ajout d'un nouveau client: ${prenom} ${nom}`);
    
    try {
      const clients = await chargerClients();
      
      const nouveauId = clients.length > 0 
        ? Math.max(...clients.map(c => c.id)) + 1 
        : 1;
      
      const nouveauClient = {
        id: nouveauId,
        nom,
        prenom,
        solde: soldeInitial,
        email
      };
      
      clients.push(nouveauClient);
      await sauvegarderClients(clients);
      
      console.log(`✅ Client ajouté avec l'ID ${nouveauId}`);
      console.log(`   Solde initial: ${soldeInitial.toFixed(2)}€`);
      
      return nouveauClient;
      
    } catch (erreur) {
      console.error(`❌ Erreur: ${erreur.message}`);
      return null;
    }
  }

export {obtenirInformationClient, chargerClients, sauvegarderClients, ajouterClient }
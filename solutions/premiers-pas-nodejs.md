**Fichier `clients.json` :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Martin",
    "email": "martin.dupont@email.com",
    "solde": 50.00
  },
  {
    "id": 2,
    "nom": "Bernard",
    "prenom": "Sophie",
    "email": "sophie.bernard@email.com",
    "solde": 75.50
  },
  {
    "id": 3,
    "nom": "Petit",
    "prenom": "Lucas",
    "email": "lucas.petit@email.com",
    "solde": 120.00
  }
]
```

**Fichier `server.js` :**
```javascript
// === SERVEUR DE GESTION DES SOLDES CLIENTS ===

import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const CLIENTS_FILE = path.join(__dirname, 'clients.json');

// === UTILITAIRES ===

async function lireClients() {
  try {
    const data = await fs.readFile(CLIENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      await fs.writeFile(CLIENTS_FILE, '[]', 'utf-8');
      return [];
    }
    throw erreur;
  }
}

async function sauvegarderClients(clients) {
  await fs.writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2), 'utf-8');
}

function lireCorpsRequete(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON invalide'));
      }
    });
    req.on('error', reject);
  });
}

function envoyerJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

// === GESTIONNAIRES DE ROUTES ===

async function obtenirTousClients(req, res) {
  try {
    const clients = await lireClients();
    envoyerJSON(res, 200, {
      succes: true,
      data: clients,
      total: clients.length
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

async function obtenirClient(req, res, id) {
  try {
    const clients = await lireClients();
    const client = clients.find(c => c.id === parseInt(id));
    
    if (!client) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Client ${id} non trouvé`
      });
      return;
    }
    
    envoyerJSON(res, 200, {
      succes: true,
      data: client
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

async function rechargerSolde(req, res, id) {
  try {
    const body = await lireCorpsRequete(req);
    
    // Validation
    if (!body.montant || body.montant <= 0) {
      envoyerJSON(res, 400, {
        succes: false,
        erreur: 'Le montant doit être supérieur à 0'
      });
      return;
    }
    
    const clients = await lireClients();
    const client = clients.find(c => c.id === parseInt(id));
    
    if (!client) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Client ${id} non trouvé`
      });
      return;
    }
    
    const ancienSolde = client.solde;
    client.solde += parseFloat(body.montant);
    
    await sauvegarderClients(clients);
    
    envoyerJSON(res, 200, {
      succes: true,
      message: 'Solde rechargé avec succès',
      data: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        ancienSolde: ancienSolde.toFixed(2),
        montantAjoute: parseFloat(body.montant).toFixed(2),
        nouveauSolde: client.solde.toFixed(2)
      }
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

async function retirerSolde(req, res, id) {
  try {
    const body = await lireCorpsRequete(req);
    
    // Validation
    if (!body.montant || body.montant <= 0) {
      envoyerJSON(res, 400, {
        succes: false,
        erreur: 'Le montant doit être supérieur à 0'
      });
      return;
    }
    
    const clients = await lireClients();
    const client = clients.find(c => c.id === parseInt(id));
    
    if (!client) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Client ${id} non trouvé`
      });
      return;
    }
    
    // Vérifier le solde
    if (client.solde < parseFloat(body.montant)) {
      envoyerJSON(res, 400, {
        succes: false,
        erreur: 'Solde insuffisant',
        details: {
          soldeActuel: client.solde.toFixed(2),
          montantDemande: parseFloat(body.montant).toFixed(2)
        }
      });
      return;
    }
    
    const ancienSolde = client.solde;
    client.solde -= parseFloat(body.montant);
    
    await sauvegarderClients(clients);
    
    envoyerJSON(res, 200, {
      succes: true,
      message: 'Retrait effectué avec succès',
      data: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        ancienSolde: ancienSolde.toFixed(2),
        montantRetire: parseFloat(body.montant).toFixed(2),
        nouveauSolde: client.solde.toFixed(2)
      }
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

async function obtenirStatistiques(req, res) {
  try {
    const clients = await lireClients();
    
    const stats = {
      nombreClients: clients.length,
      soldeTotal: clients.reduce((sum, c) => sum + c.solde, 0),
      soldeMoyen: 0,
      soldeMin: clients.length > 0 ? Math.min(...clients.map(c => c.solde)) : 0,
      soldeMax: clients.length > 0 ? Math.max(...clients.map(c => c.solde)) : 0
    };
    
    stats.soldeMoyen = clients.length > 0 ? stats.soldeTotal / clients.length : 0;
    
    envoyerJSON(res, 200, {
      succes: true,
      data: {
        nombreClients: stats.nombreClients,
        soldeTotal: stats.soldeTotal.toFixed(2) + '€',
        soldeMoyen: stats.soldeMoyen.toFixed(2) + '€',
        soldeMin: stats.soldeMin.toFixed(2) + '€',
        soldeMax: stats.soldeMax.toFixed(2) + '€'
      }
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

// === ROUTEUR ===

async function router(req, res) {
  const { method, url } = req;
  
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  
  // Page d'accueil
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>API Soldes Clients</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            ul { line-height: 1.8; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>💳 API de Gestion des Soldes Clients</h1>
          <h2>Endpoints disponibles:</h2>
          <ul>
            <li><code>GET /api/clients</code> - Liste tous les clients</li>
            <li><code>GET /api/clients/:id</code> - Obtenir un client</li>
            <li><code>POST /api/clients/:id/recharge</code> - Recharger un solde</li>
            <li><code>POST /api/clients/:id/retrait</code> - Retirer du solde</li>
            <li><code>GET /api/stats</code> - Statistiques globales</li>
          </ul>
          <p>Utilisez Postman ou curl pour tester l'API</p>
        </body>
      </html>
    `);
    return;
  }
  
  // Routes API
  if (url === '/api/clients' && method === 'GET') {
    await obtenirTousClients(req, res);
    return;
  }
  
  if (url === '/api/stats' && method === 'GET') {
    await obtenirStatistiques(req, res);
    return;
  }
  
  const matchClient = url.match(/^\/api\/clients\/(\d+)$/);
  if (matchClient && method === 'GET') {
    await obtenirClient(req, res, matchClient[1]);
    return;
  }
  
  const matchRecharge = url.match(/^\/api\/clients\/(\d+)\/recharge$/);
  if (matchRecharge && method === 'POST') {
    await rechargerSolde(req, res, matchRecharge[1]);
    return;
  }
  
  const matchRetrait = url.match(/^\/api\/clients\/(\d+)\/retrait$/);
  if (matchRetrait && method === 'POST') {
    await retirerSolde(req, res, matchRetrait[1]);
    return;
  }
  
  // Route non trouvée
  envoyerJSON(res, 404, {
    succes: false,
    erreur: 'Route non trouvée'
  });
}

// === SERVEUR ===

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   💳 API Soldes Clients               ║
╚════════════════════════════════════════╝

📍 URL: http://localhost:${PORT}
📊 API: http://localhost:${PORT}/api/clients

✅ Serveur démarré avec succès !
  `);
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});
```

**Points à souligner lors de la correction :**

1. **Validation des données** :
   - Toujours valider les entrées utilisateur
   - Vérifier les types et les valeurs
   - Retourner des erreurs claires (400)

2. **Codes de statut appropriés** :
   - 200 pour succès
   - 400 pour requête invalide
   - 404 pour ressource non trouvée
   - 500 pour erreur serveur

3. **Réponses structurées** :
   - Format JSON cohérent
   - Toujours inclure `succes: true/false`
   - Messages d'erreur explicites

4. **Gestion des erreurs** :
   - Try/catch partout
   - Ne jamais laisser le serveur crasher
   - Logger les erreurs

5. **Atomicité des opérations** :
   - Charger → Modifier → Sauvegarder
   - Pattern cohérent dans toute l'application

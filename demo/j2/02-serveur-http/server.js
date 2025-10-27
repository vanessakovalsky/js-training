// === SERVEUR HTTP POUR GESTION DE STOCK ===

import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const STOCK_FILE = path.join(__dirname, 'stock.json');

// === UTILITAIRES ===

/**
 * Lire le stock
 */
async function lireStock() {
  try {
    const data = await fs.readFile(STOCK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      // Créer un fichier vide si inexistant
      await fs.writeFile(STOCK_FILE, '[]', 'utf-8');
      return [];
    }
    throw erreur;
  }
}

/**
 * Sauvegarder le stock
 */
async function sauvegarderStock(stock) {
  await fs.writeFile(STOCK_FILE, JSON.stringify(stock, null, 2), 'utf-8');
}

/**
 * Lire le corps de la requête
 */
function lireCorpsRequete(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (erreur) {
        reject(new Error('JSON invalide'));
      }
    });
    
    req.on('error', reject);
  });
}

/**
 * Envoyer une réponse JSON
 */
function envoyerJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*' // CORS
  });
  res.end(JSON.stringify(data, null, 2));
}

// === GESTIONNAIRES DE ROUTES ===

/**
 * GET /api/stock - Obtenir tous les produits
 */
async function obtenirStock(req, res) {
  try {
    const stock = await lireStock();
    envoyerJSON(res, 200, {
      succes: true,
      data: stock,
      total: stock.length
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

/**
 * GET /api/stock/:id - Obtenir un produit
 */
async function obtenirProduit(req, res, id) {
  try {
    const stock = await lireStock();
    const produit = stock.find(p => p.id === parseInt(id));
    
    if (!produit) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
      return;
    }
    
    envoyerJSON(res, 200, {
      succes: true,
      data: produit
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

/**
 * POST /api/stock - Ajouter un produit
 */
async function ajouterProduit(req, res) {
  try {
    const body = await lireCorpsRequete(req);
    
    // Validation
    if (!body.nom || !body.prix || body.quantite === undefined) {
      envoyerJSON(res, 400, {
        succes: false,
        erreur: 'Champs requis: nom, prix, quantite'
      });
      return;
    }
    
    const stock = await lireStock();
    
    // Générer un nouvel ID
    const nouvelId = stock.length > 0 
      ? Math.max(...stock.map(p => p.id)) + 1 
      : 1;
    
    const nouveauProduit = {
      id: nouvelId,
      nom: body.nom,
      prix: parseFloat(body.prix),
      quantite: parseInt(body.quantite)
    };
    
    stock.push(nouveauProduit);
    await sauvegarderStock(stock);
    
    envoyerJSON(res, 201, {
      succes: true,
      message: 'Produit ajouté',
      data: nouveauProduit
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

/**
 * PUT /api/stock/:id - Mettre à jour un produit
 */
async function mettreAJourProduit(req, res, id) {
  try {
    const body = await lireCorpsRequete(req);
    const stock = await lireStock();
    const index = stock.findIndex(p => p.id === parseInt(id));
    
    if (index === -1) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
      return;
    }
    
    // Mettre à jour les champs fournis
    if (body.nom !== undefined) stock[index].nom = body.nom;
    if (body.prix !== undefined) stock[index].prix = parseFloat(body.prix);
    if (body.quantite !== undefined) stock[index].quantite = parseInt(body.quantite);
    
    await sauvegarderStock(stock);
    
    envoyerJSON(res, 200, {
      succes: true,
      message: 'Produit mis à jour',
      data: stock[index]
    });

    await sauvegarderStock(stock);
    
    envoyerJSON(res, 200, {
      succes: true,
      message: 'Produit mis à jour',
      data: stock[index]
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

/**
 * DELETE /api/stock/:id - Supprimer un produit
 */
async function supprimerProduit(req, res, id) {
  try {
    const stock = await lireStock();
    const index = stock.findIndex(p => p.id === parseInt(id));
    
    if (index === -1) {
      envoyerJSON(res, 404, {
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
      return;
    }
    
    const produitSupprime = stock.splice(index, 1)[0];
    await sauvegarderStock(stock);
    
    envoyerJSON(res, 200, {
      succes: true,
      message: 'Produit supprimé',
      data: produitSupprime
    });
  } catch (erreur) {
    envoyerJSON(res, 500, {
      succes: false,
      erreur: erreur.message
    });
  }
}

// === ROUTEUR ===

/**
 * Router principal
 */
async function router(req, res) {
  const { method, url } = req;
  
  console.log(`${method} ${url}`);
  
  // Page d'accueil
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>API Stock</title>
        </head>
        <body>
          <h1>🏪 API de Gestion de Stock</h1>
          <h2>Endpoints disponibles:</h2>
          <ul>
            <li>GET /api/stock - Liste tous les produits</li>
            <li>GET /api/stock/:id - Obtenir un produit</li>
            <li>POST /api/stock - Ajouter un produit</li>
            <li>PUT /api/stock/:id - Mettre à jour un produit</li>
            <li>DELETE /api/stock/:id - Supprimer un produit</li>
          </ul>
          <p>Utilisez Postman ou curl pour tester l'API</p>
        </body>
      </html>
    `);
    return;
  }
  
  // GET /api/stock - Liste tous les produits
  if (url === '/api/stock' && method === 'GET') {
    await obtenirStock(req, res);
    return;
  }
  
  // POST /api/stock - Ajouter un produit
  if (url === '/api/stock' && method === 'POST') {
    await ajouterProduit(req, res);
    return;
  }
  
  // Routes avec paramètre :id
  const matchGet = url.match(/^\/api\/stock\/(\d+)$/);
  if (matchGet && method === 'GET') {
    await obtenirProduit(req, res, matchGet[1]);
    return;
  }
  
  const matchPut = url.match(/^\/api\/stock\/(\d+)$/);
  if (matchPut && method === 'PUT') {
    await mettreAJourProduit(req, res, matchPut[1]);
    return;
  }
  
  const matchDelete = url.match(/^\/api\/stock\/(\d+)$/);
  if (matchDelete && method === 'DELETE') {
    await supprimerProduit(req, res, matchDelete[1]);
    return;
  }
  
  // Route non trouvée
  envoyerJSON(res, 404, {
    succes: false,
    erreur: 'Route non trouvée'
  });
}

// === CRÉATION DU SERVEUR ===

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Serveur démarré avec succès !     ║
╚════════════════════════════════════════╝

📍 URL: http://localhost:${PORT}
📊 API: http://localhost:${PORT}/api/stock

Appuyez sur Ctrl+C pour arrêter le serveur
  `);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});
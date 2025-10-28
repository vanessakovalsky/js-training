// === APPLICATION EXPRESS ===

import express from 'express';
import produitsRoutes from './routes/produits.routes.js';
import { logger } from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// === MIDDLEWARES GLOBAUX ===

// Parser JSON
app.use(express.json());

// Logger
app.use(logger);

// CORS simple (pour le développement)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// === ROUTES ===

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <h1>🏪 API de Gestion de Stock</h1>
    <h2>Endpoints disponibles:</h2>
    <ul>
      <li>GET /api/produits - Liste tous les produits</li>
      <li>GET /api/produits/:id - Obtenir un produit</li>
      <li>POST /api/produits - Créer un produit</li>
      <li>PUT /api/produits/:id - Mettre à jour un produit</li>
      <li>DELETE /api/produits/:id - Supprimer un produit</li>
    </ul>
  `);
});

// Routes API
app.use('/api/produits', produitsRoutes);

// === GESTION DES ERREURS ===

// Route non trouvée
app.use(notFound);

// Gestionnaire d'erreurs global
app.use(errorHandler);

export default app;
```

**Fichier `server.js` :**
```javascript
// === SERVEUR ===

import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Serveur Express démarré !         ║
╚════════════════════════════════════════╝

📍 URL: http://localhost:${PORT}
📊 API: http://localhost:${PORT}/api/produits

Appuyez sur Ctrl+C pour arrêter
  `);
});
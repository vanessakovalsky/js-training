// === SERVEUR EXPRESS BASIQUE ===

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.send('<h1>🏪 API de Gestion de Stock</h1>');
});

// Route API simple
app.get('/api/produits', (req, res) => {
  const produits = [
    { id: 1, nom: 'Souris sans fil', prix: 29.99, quantite: 50 },
    { id: 2, nom: 'Clavier mécanique', prix: 89.99, quantite: 15 }
  ];
  
  res.json({
    succes: true,
    data: produits,
    total: produits.length
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
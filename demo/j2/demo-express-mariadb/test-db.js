// === TEST DE CONNEXION ===

import pool, { testerConnexion } from './src/config/database.js';

async function test() {
  console.log('=== TEST DE CONNEXION À MARIADB ===\n');
  
  // Tester la connexion
  await testerConnexion();
  
  try {
    // Exécuter une requête simple
    const [rows] = await pool.query('SELECT * FROM produits');
    
    console.log('\n=== PRODUITS DANS LA BASE ===');
    rows.forEach(produit => {
      console.log(`[${produit.id}] ${produit.nom} - ${produit.prix}€ (stock: ${produit.quantite})`);
    });
    
    console.log(`\nTotal: ${rows.length} produits`);
    
  } catch (erreur) {
    console.error('❌ Erreur:', erreur.message);
  } finally {
    await pool.end();
  }
}

test();
**Fichier `src/services/clients.service.js` :**
```javascript
// === SERVICE DES CLIENTS ===

import pool from '../config/database.js';

export async function obtenirTous() {
  const [rows] = await pool.query('SELECT * FROM clients ORDER BY nom, prenom');
  return rows;
}

export async function obtenirParId(id) {
  const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function rechargerSolde(id, montant) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Vérifier que le client existe
    const [clients] = await connection.query('SELECT * FROM clients WHERE id = ?', [id]);
    if (clients.length === 0) {
      await connection.rollback();
      return null;
    }
    
    const client = clients[0];
    const ancienSolde = parseFloat(client.solde);
    const nouveauSolde = ancienSolde + parseFloat(montant);
    
    // Mettre à jour le solde
    await connection.query('UPDATE clients SET solde = ? WHERE id = ?', [nouveauSolde, id]);
    
    await connection.commit();
    
    return {
      ...client,
      ancienSolde,
      nouveauSolde,
      montantAjoute: parseFloat(montant)
    };
  } catch (erreur) {
    await connection.rollback();
    throw erreur;
  } finally {
    connection.release();
  }
}

export async function obtenirReservations(clientId) {
  const [rows] = await pool.query(
    'SELECT * FROM reservations WHERE client_id = ? ORDER BY date_reservation DESC',
    [clientId]
  );
  return rows;
}
```

**Fichier `src/services/reservations.service.js` :**
```javascript
// === SERVICE DES RÉSERVATIONS ===

import pool from '../config/database.js';

export async function obtenirTous() {
  const [rows] = await pool.query(`
    SELECT 
      r.*,
      c.nom,
      c.prenom,
      c.email
    FROM reservations r
    JOIN clients c ON r.client_id = c.id
    ORDER BY r.date_reservation DESC
  `);
  return rows;
}

export async function creer(donnees) {
  const { client_id, activite, date_reservation, cout } = donnees;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Vérifier que le client existe
    const [clients] = await connection.query('SELECT * FROM clients WHERE id = ?', [client_id]);
    if (clients.length === 0) {
      await connection.rollback();
      throw new Error('Client non trouvé');
    }
    
    const client = clients[0];
    
    // 2. Vérifier que le solde est suffisant
    if (parseFloat(client.solde) < parseFloat(cout)) {
      await connection.rollback();
      throw new Error(`Solde insuffisant (disponible: ${client.solde}€, requis: ${cout}€)`);
    }
    
    // 3. Créer la réservation
    const [result] = await connection.query(
      'INSERT INTO reservations (client_id, activite, date_reservation, cout) VALUES (?, ?, ?, ?)',
      [client_id, activite, date_reservation, cout]
    );
    
    // 4. Déduire le coût du solde
    const nouveauSolde = parseFloat(client.solde) - parseFloat(cout);
    await connection.query('UPDATE clients SET solde = ? WHERE id = ?', [nouveauSolde, client_id]);
    
    await connection.commit();
    
    // 5. Récupérer la réservation créée
    const [reservations] = await connection.query(
      'SELECT * FROM reservations WHERE id = ?',
      [result.insertId]
    );
    
    return {
      ...reservations[0],
      ancienSolde: parseFloat(client.solde),
      nouveauSolde
    };
  } catch (erreur) {
    await connection.rollback();
    throw erreur;
  } finally {
    connection.release();
  }
}

export async function annuler(id) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Récupérer la réservation
    const [reservations] = await connection.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );
    
    if (reservations.length === 0) {
      await connection.rollback();
      return null;
    }
    
    const reservation = reservations[0];
    
    if (reservation.statut === 'annulee') {
      await connection.rollback();
      throw new Error('Réservation déjà annulée');
    }
    
    // 2. Marquer comme annulée
    await connection.query(
      'UPDATE reservations SET statut = ? WHERE id = ?',
      ['annulee', id]
    );
    
    // 3. Rembourser le client
    await connection.query(
      'UPDATE clients SET solde = solde + ? WHERE id = ?',
      [reservation.cout, reservation.client_id]
    );
    
    await connection.commit();
    
    return reservation;
  } catch (erreur) {
    await connection.rollback();
    throw erreur;
  } finally {
    connection.release();
  }
}
```

**Fichier `src/controllers/clients.controller.js` :**
```javascript
// === CONTRÔLEUR DES CLIENTS ===

import * as clientsService from '../services/clients.service.js';

export const obtenirTous = async (req, res, next) => {
  try {
    const clients = await clientsService.obtenirTous();
    res.json({ succes: true, data: clients, total: clients.length });
  } catch (erreur) {
    next(erreur);
  }
};

export const obtenirParId = async (req, res, next) => {
  try {
    const client = await clientsService.obtenirParId(req.params.id);
    if (!client) {
      return res.status(404).json({ succes: false, erreur: 'Client non trouvé' });
    }
    res.json({ succes: true, data: client });
  } catch (erreur) {
    next(erreur);
  }
};

export const rechargerSolde = async (req, res, next) => {
  try {
    const { montant } = req.body;
    
    if (!montant || montant <= 0) {
      return res.status(400).json({
        succes: false,
        erreur: 'Le montant doit être supérieur à 0'
      });
    }
    
    const resultat = await clientsService.rechargerSolde(req.params.id, montant);
    
    if (!resultat) {
      return res.status(404).json({ succes: false, erreur: 'Client non trouvé' });
    }
    
    res.json({
      succes: true,
      message: 'Solde rechargé avec succès',
      data: {
        clientId: resultat.id,
        nom: `${resultat.prenom} ${resultat.nom}`,
        ancienSolde: resultat.ancienSolde.toFixed(2) + '€',
        montantAjoute: resultat.montantAjoute.toFixed(2) + '€',
        nouveauSolde: resultat.nouveauSolde.toFixed(2) + '€'
      }
    });
  } catch (erreur) {
    next(erreur);
  }
};

export const obtenirReservations = async (req, res, next) => {
  try {
    const reservations = await clientsService.obtenirReservations(req.params.id);
    res.json({ succes: true, data: reservations, total: reservations.length });
  } catch (erreur) {
    next(erreur);
  }
};
```

**Fichier `src/controllers/reservations.controller.js` :**
```javascript
// === CONTRÔLEUR DES RÉSERVATIONS ===

import * as reservationsService from '../services/reservations.service.js';

export const obtenirTous = async (req, res, next) => {
  try {
    const reservations = await reservationsService.obtenirTous();
    res.json({ succes: true, data: reservations, total: reservations.length });
  } catch (erreur) {
    next(erreur);
  }
};

export const creer = async (req, res, next) => {
  try {
    const { client_id, activite, date_reservation, cout } = req.body;
    
    // Validation
    if (!client_id || !activite || !date_reservation || !cout) {
      return res.status(400).json({
        succes: false,
        erreur: 'Tous les champs sont requis: client_id, activite, date_reservation, cout'
      });
    }
    
    if (cout <= 0) {
      return res.status(400).json({
        succes: false,
        erreur: 'Le coût doit être supérieur à 0'
      });
    }
    
    const reservation = await reservationsService.creer(req.body);
    
    res.status(201).json({
      succes: true,
      message: 'Réservation créée avec succès',
      data: {
        id: reservation.id,
        activite: reservation.activite,
        date: reservation.date_reservation,
        cout: reservation.cout,
        ancienSolde: reservation.ancienSolde.toFixed(2) + '€',
        nouveauSolde: reservation.nouveauSolde.toFixed(2) + '€'
      }
    });
  } catch (erreur) {
    if (erreur.message.includes('Solde insuffisant') || erreur.message.includes('Client non trouvé')) {
      return res.status(400).json({
        succes: false,
        erreur: erreur.message
      });
    }
    next(erreur);
  }
};

export const annuler = async (req, res, next) => {
  try {
    const reservation = await reservationsService.annuler(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        succes: false,
        erreur: 'Réservation non trouvée'
      });
    }
    
    res.json({
      succes: true,
      message: 'Réservation annulée et solde remboursé',
      data: reservation
    });
  } catch (erreur) {
    if (erreur.message === 'Réservation déjà annulée') {
      return res.status(400).json({
        succes: false,
        erreur: erreur.message
      });
    }
    next(erreur);
  }
};
```

**Fichier `src/routes/clients.routes.js` :**
```javascript
import express from 'express';
import * as clientsController from '../controllers/clients.controller.js';

const router = express.Router();

router.get('/', clientsController.obtenirTous);
router.get('/:id', clientsController.obtenirParId);
router.post('/:id/recharge', clientsController.rechargerSolde);
router.get('/:id/reservations', clientsController.obtenirReservations);

export default router;
```

**Fichier `src/routes/reservations.routes.js` :**
```javascript
import express from 'express';
import * as reservationsController from '../controllers/reservations.controller.js';

const router = express.Router();

router.get('/', reservationsController.obtenirTous);
router.post('/', reservationsController.creer);
router.delete('/:id', reservationsController.annuler);

export default router;
```

**Fichier `src/app.js` (ajouter les routes) :**
```javascript
import express from 'express';
import clientsRoutes from './routes/clients.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import { logger } from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send(`
    <h1>🏋️ API Salle de Sport</h1>
    <h2>Endpoints:</h2>
    <h3>Clients:</h3>
    <ul>
      <li>GET /api/clients</li>
      <li>GET /api/clients/:id</li>
      <li>POST /api/clients/:id/recharge</li>
      <li>GET /api/clients/:id/reservations</li>
    </ul>
    <h3>Réservations:</h3>
    <ul>
      <li>GET /api/reservations</li>
      <li>POST /api/reservations</li>
      <li>DELETE /api/reservations/:id</li>
    </ul>
  `);
});

app.use('/api/clients', clientsRoutes);
app.use('/api/reservations', reservationsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
```

**Points à souligner lors de la correction :**

1. **Transactions SQL** :
   - `beginTransaction()` pour démarrer
   - `commit()` pour valider
   - `rollback()` en cas d'erreur
   - Garantit l'atomicité (tout ou rien)

2. **Gestion des connexions** :
   - `getConnection()` pour les transactions
   - `release()` dans finally (toujours libérer)
   - Pool gère automatiquement sans transaction

3. **Validation métier** :
   - Vérifier le solde avant réservation
   - Vérifier l'existence du client
   - Empêcher double annulation

4. **Jointures SQL** :
   - JOIN pour lier tables
   - Récupérer données liées en une requête
   - Plus efficace que requêtes multiples

5. **Codes de statut appropriés** :
   - 400 pour erreur métier (solde insuffisant)
   - 404 pour ressource non trouvée
   - 201 pour création réussie

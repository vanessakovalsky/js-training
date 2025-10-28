// === ROUTES DES PRODUITS ===

import express from 'express';
import * as produitsController from '../controllers/produits.controller.js';
import { validateProduit, validateId } from '../middlewares/validator.js';

const router = express.Router();

// GET /api/produits - Liste tous les produits
router.get('/', produitsController.obtenirTous);

// GET /api/produits/:id - Obtenir un produit
router.get('/:id', validateId, produitsController.obtenirParId);

// POST /api/produits - Créer un produit
router.post('/', validateProduit, produitsController.creer);

// PUT /api/produits/:id - Mettre à jour un produit
router.put('/:id', validateId, validateProduit, produitsController.mettreAJour);

// DELETE /api/produits/:id - Supprimer un produit
router.delete('/:id', validateId, produitsController.supprimer);

export default router;
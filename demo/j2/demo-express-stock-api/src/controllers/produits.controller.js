// === CONTRÔLEUR DES PRODUITS ===

import * as produitsService from '../services/produits.service.js';

/**
 * GET /api/produits - Obtenir tous les produits
 */
export const obtenirTous = async (req, res, next) => {
  try {
    const produits = await produitsService.obtenirTous();
    
    res.json({
      succes: true,
      data: produits,
      total: produits.length
    });
  } catch (erreur) {
    next(erreur);
  }
};

/**
 * GET /api/produits/:id - Obtenir un produit
 */
export const obtenirParId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produit = await produitsService.obtenirParId(id);
    
    if (!produit) {
      return res.status(404).json({
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
    }
    
    res.json({
      succes: true,
      data: produit
    });
  } catch (erreur) {
    next(erreur);
  }
};

/**
 * POST /api/produits - Créer un produit
 */
export const creer = async (req, res, next) => {
  try {
    const nouveauProduit = await produitsService.creer(req.body);
    
    res.status(201).json({
      succes: true,
      message: 'Produit créé avec succès',
      data: nouveauProduit
    });
  } catch (erreur) {
    next(erreur);
  }
};

/**
 * PUT /api/produits/:id - Mettre à jour un produit
 */
export const mettreAJour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produitMisAJour = await produitsService.mettreAJour(id, req.body);
    
    if (!produitMisAJour) {
      return res.status(404).json({
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
    }
    
    res.json({
      succes: true,
      message: 'Produit mis à jour avec succès',
      data: produitMisAJour
    });
  } catch (erreur) {
    next(erreur);
  }
};

/**
 * DELETE /api/produits/:id - Supprimer un produit
 */
export const supprimer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produitSupprime = await produitsService.supprimer(id);
    
    if (!produitSupprime) {
      return res.status(404).json({
        succes: false,
        erreur: `Produit ${id} non trouvé`
      });
    }
    
    res.json({
      succes: true,
      message: 'Produit supprimé avec succès',
      data: produitSupprime
    });
  } catch (erreur) {
    next(erreur);
  }
};
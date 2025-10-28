// === MIDDLEWARE DE VALIDATION ===

export const validateProduit = (req, res, next) => {
    const { nom, prix, quantite } = req.body;
    
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      return res.status(400).json({
        succes: false,
        erreur: 'Le nom est requis et doit être une chaîne non vide'
      });
    }
    
    if (prix === undefined || typeof prix !== 'number' || prix < 0) {
      return res.status(400).json({
        succes: false,
        erreur: 'Le prix est requis et doit être un nombre positif'
      });
    }
    
    if (quantite === undefined || !Number.isInteger(quantite) || quantite < 0) {
      return res.status(400).json({
        succes: false,
        erreur: 'La quantité est requise et doit être un entier positif'
      });
    }
    
    next();
  };
  
  export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        succes: false,
        erreur: 'ID invalide'
      });
    }
    
    req.params.id = id; // Convertir en nombre
    next();
  };
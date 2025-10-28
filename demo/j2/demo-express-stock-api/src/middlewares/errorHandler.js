// === MIDDLEWARE DE GESTION D'ERREURS ===

export const errorHandler = (err, req, res, next) => {
    console.error('❌ Erreur:', err);
    
    // Erreur de parsing JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        succes: false,
        erreur: 'JSON invalide dans le corps de la requête'
      });
    }
    
    // Erreur générique
    res.status(err.status || 500).json({
      succes: false,
      erreur: err.message || 'Erreur interne du serveur'
    });
  };
  
  // Middleware pour les routes non trouvées
  export const notFound = (req, res) => {
    res.status(404).json({
      succes: false,
      erreur: 'Route non trouvée'
    });
  };
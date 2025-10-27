// === UTILITAIRES DE FORMATAGE ===

// Formater un prix
export const formaterPrix = (prix) => {
    return `${prix.toFixed(2)}€`;
  };
  
  // Formater une date
  export const formaterDate = (date = new Date()) => {
    return date.toLocaleDateString('fr-FR');
  };
  
  // Formater un pourcentage
  export const formaterPourcentage = (valeur) => {
    return `${(valeur * 100).toFixed(1)}%`;
  };
  
  // Créer un message de statut
  export const creerMessageStatut = (quantite, seuil) => {
    if (quantite === 0) {
      return "⚠️ RUPTURE";
    } else if (quantite < seuil) {
      return "⚠️ FAIBLE";
    } else {
      return "✅ OK";
    }
  };
  
  // Export par défaut : objet groupant toutes les fonctions
  export default {
    formaterPrix,
    formaterDate,
    formaterPourcentage,
    creerMessageStatut
  };
// === MODÈLE PRODUIT ===

export default class Produit {
    constructor(id, nom, prix, quantite, categorie) {
      this.id = id;
      this.nom = nom;
      this.prix = prix;
      this.quantite = quantite;
      this.categorie = categorie;
    }
  
    // Méthode pour calculer la valeur
    getValeur() {
      return this.prix * this.quantite;
    }
  
    // Méthode pour vérifier le stock
    estEnStock() {
      return this.quantite > 0;
    }
  
    // Méthode pour afficher
    toString() {
      return `${this.nom} (${this.quantite} unités @ ${this.prix}€)`;
    }
  }
  
  // Export de constantes utiles
  export const SEUIL_ALERTE = 10;
  export const CATEGORIES = {
    PERIPHERIQUES: "Périphériques",
    MONITEURS: "Moniteurs",
    AUDIO: "Audio",
    VIDEO: "Vidéo"
  };
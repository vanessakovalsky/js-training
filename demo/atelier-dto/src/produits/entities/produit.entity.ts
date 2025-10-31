// === ENTITÉ PRODUIT ===

export class Produit {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    categorie?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
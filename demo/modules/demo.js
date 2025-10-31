import { TAUX_TVA, validePrix, valideQuantite } from "./utils/validation";

const inventaire = [
    {
      id: 1,
      nom: "Souris sans fil",
      prix: 29.99,
      quantite: 50,
      categorie: "Périphériques",
      seuilAlerte: 20
    },
    {
      id: 2,
      nom: "Clavier mécanique",
      prix: 89.99,
      quantite: 15,
      categorie: "Périphériques",
      seuilAlerte: 10
    },
    {
      id: 3,
      nom: "Écran 24 pouces",
      prix: 199.99,
      quantite: 8,
      categorie: "Moniteurs",
      seuilAlerte: 5
    },
    {
      id: 4,
      nom: "Webcam HD",
      prix: 49.99,
      quantite: 30,
      categorie: "Vidéo",
      seuilAlerte: 15
    },
    {
      id: 5,
      nom: "Casque audio",
      prix: 79.99,
      quantite: 0,
      categorie: "Audio",
      seuilAlerte: 10
    }
  ];

const calculTva = (prix, niveau_taux) => {
  return validePrix(prix) * TAUX_TVA[niveau_taux];
}

const calculerValeur = produit => produit.prix * produit.quantite;
// function calculerValeur(produit){
//     return produit.prix * produit.quantite;
// }
console.log(calculerValeur(inventaire[3]));

const afficherProduit = ({id, nom, prix, quantite}) => {
    const valeur = prix * quantite;
    console.log(`ID : ${id} - Nom : ${nom} - Prix : ${prix} - Quantité : ${quantite}`)
}

inventaire.forEach(afficherProduit);

const[premierProduit, deuxiemeProduit, ...autresProduits] = inventaire;
console.log(`Premier produit : ${premierProduit.nom}`)
console.log(`Deuxième produit : ${deuxiemeProduit.prix}`)
console.log(`Autres produits : ${autresProduits[0].id}`)

const rapportStock = inventaire
    .filter(({quantite}) => quantite < 20)
    .map(({nom, quantite, prix}) => {
        return ({
            nom,
            quantite,
            valeur: quantite * prix,
            statut: quantite === 0 ? "RUPTURE" : "FAIBLE"
        });
    })
    .sort((a,b) => a.quantite - b.quantite);
console.log(rapportStock);
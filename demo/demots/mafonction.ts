interface Produit {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
}

function calculerPrixTotal(produits: Produit[]) : number{
    return produits.reduce((total, p) => {
      return total + (p.prix * p.quantite);
    }, 0);
}

let calculTotal = calculerPrixTotal([{id:1,nom:"Souris",prix:29.99,quantite:15}]);
console.log(calculTotal);
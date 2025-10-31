function calculerPrixTotal(produits) {
    return produits.reduce(function (total, p) {
        return total + (p.prix * p.quantite);
    }, 0);
}
var total = calculerPrixTotal([{ id: 1, nom: "Souris", prix: 29.99, quantite: 15 }]);
console.log(total);

const TAUX_TVA = [
    '5.5',
    '10',
    '20'
]

const validePrix = (prix) => {
    if(prix > 0 ){
        return prix
    } else {
        console.log('erreur le prix est egal ou inférieur à 0')
    }
}

const valideQuantite = (quantite) => {
    console.log(quantite);
}

export { TAUX_TVA, validePrix, valideQuantite }
const maPromise = new Promise ((resolve, reject ) => {
    setTimeout(() => {
        resolve("resultat")
    }, 5) 
})

maPromise
    .then(resultat => console.log(resultat))
    .catch(erreur => console.log(erreur))
    .finally(() => console.log("Terminé"));
import http from "http";
import { chargerClients, obtenirInformationClient} from './modules/client.js'
import { rechargerSolde } from './modules/solde.js'

const server = http.createServer(async(req, res) => {
  const url = new URL(req.url, "http://${req.headers.host}");
  const pathParts = url.pathname.split("/").filter(Boolean);
  // /api/client/12
// GET /api/clients/:id : Obtenir un client spécifique
if (pathParts[0] === "api" && pathParts[1] === "client" && pathParts[2] !== undefined && pathParts[3] === 'recharge' && req.method == 'POST') {
    const id = pathParts[2];
    let body = [];
    req
    .on('data', chunk => {
        body.push(chunk);
    })
    .on('end', async () => {
        body = Buffer.concat(body).toString();
        console.log(body);
        const montant = body.montant;
        console.log(montant);
        const recharge = await rechargerSolde(id, montant);
        // POST /api/clients/:id/recharge : Recharger le solde d'un client
        console.log(recharge);
        // at this point, `body` has the entire request body stored in it as a string
    });
}   else if (req.url === "/api/client") {
    //   GET /api/clients : Liste tous les clients avec leurs soldes
    const clients = await chargerClients();
    console.log(clients);
    res.end(JSON.stringify(clients));
  } else if (pathParts[0] === "api" && pathParts[1] === "client" && pathParts[2] !== undefined) {
    const id = pathParts[2];
    // on appelle la méthode pour retrouver le client avec l'id
    const client = await obtenirInformationClient(id);
    console.log(client);
    res.end(JSON.stringify(client));
  } else {
    res.writeHead(404);
    res.end("Non trouvé");
  }
});

server.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});

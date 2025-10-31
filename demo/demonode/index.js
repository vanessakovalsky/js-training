import http from 'http';
      
      const server = http.createServer((req, res) => {
        const url = new URL(req.url, 'http://${req.headers.host}');
        const pathParts = url.pathname.split('/').filter(Boolean);

        console.log('avec pathPart');
        console.log(pathParts[2]);
        const matchClient = req.url.match(/^\/api\/client\/(\d+)$/);
        console.log('match')
        console.log(matchClient[1]);
        // /api/client/12
        if (pathParts[0] === 'api' && pathParts[1] === 'client' && pathParts[2]){
            const id = pathParts[2]
            // on appelle la méthode pour retrouver le client avec l'id
        } else if (req.url === '/') {
            res.end('Page d\'accueil');
          } else if (req.url === '/api/produits') {
            res.end(JSON.stringify({ produits: [] }));
          } else {
            res.writeHead(404);
            res.end('Non trouvé');
          }
      });
      
      server.listen(3000, () => {
        console.log('Serveur démarré sur http://localhost:3000');
      });
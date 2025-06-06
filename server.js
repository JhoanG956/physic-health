const next = require('next');
const https = require('https');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  https
    .createServer(
      {
        key: fs.readFileSync('./ssl/localhost-key.pem'), // Ruta de la clave privada
        cert: fs.readFileSync('./ssl/localhost.pem'),   // Ruta del certificado
      },
      (req, res) => {
        handle(req, res); // Llamar al manejador de Next.js
      }
    )
    .listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on https://localhost:3000');
    });
});

import fs from 'fs';
import tls from 'tls';
import https from 'https';
import path from 'path';
import express from 'express';

const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, '..', 'server', 'server_key.pem')
  ),
  cert: fs.readFileSync(
    path.resolve(__dirname, '..', 'server', 'server_cert.pem')
  ),
  requestCert: true,
  rejectUnauthorized: false,
  ca: [
    fs.readFileSync(path.resolve(__dirname, '..', 'server', 'server_cert.pem')),
  ],
};

const app = express();

app.get('/', (req, res) => {
  res.send('<a href="/authenticate">Log in using client certificate</a>');
});

app.get('/authenticate', (req, res) => {
  const socket = req.socket as tls.TLSSocket;
  const cert = socket.getPeerCertificate();
  if (socket.authorized) {
    res.send(
      `Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`
    );
  } else if (cert.subject) {
    res
      .status(403)
      .send(
        `Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`
      );
  } else {
    res
      .status(401)
      .send(`Sorry, but you need to provide a client certificate to continue.`);
  }
});

https.createServer(options, app).listen(4433, () => {
  console.log(`Server started on port 4433`);
});

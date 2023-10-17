// run app on https server
require('dotenv').config()
const https = require('https');
const fs = require('fs');
const app = require('./app');
const options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};
const server = https.createServer(options, app);

server.listen(process.env.APP_PORT, () =>
  console.log("Server listening on port", process.env.APP_PORT)
);
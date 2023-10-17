const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const app = express();
const indexRoute = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/test').then(() => console.log('connected to test db')).catch((err) => console.log('Error while connecting to mongodb', err));

app.use(express.json());

app.use(express.static(path.join(__dirname, "files")));

app.get('/', (req, res) => {
    res.status(200).send(`This is a test app! running on PORT ${process.env.APP_PORT}. Hostname: ${req.hostname}, Url: ${req.url}, baseUrl: ${req.baseUrl}, originalUrl: ${req.originalUrl}`)
});

app.use("/api", indexRoute);

module.exports = app;
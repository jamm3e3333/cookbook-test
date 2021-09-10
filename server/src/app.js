const express = require('express');
const app = express();
require('../db/database');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>hello from express server</h1>');
})

module.exports = app;
const User = require('../models/users');
const express = require('express');
const app = express();
require('../db/database');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>hello from express server</h1>');
});

app.post('/users/signup', async (req, res) => {
    try{
        if(!req.body) {
            return res.status(404)
                        .send("No data was sent.");
        }
        const user = new User(req.body);
        if(!user) {
            return res.status(400)
                        .send("Error while creating a user.");
        }
        await user.save();
        res.status(201)
            .send(user);
    }
    catch(e) {
        res.status(400)
            .send(e);
    }
})
module.exports = app;
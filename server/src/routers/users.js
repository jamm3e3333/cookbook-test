const User = require('../../models/users');
const Recipe = require('../../models/recipes');
const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');


//USER SIGNUP
router.post('/users/signup', async (req, res) => {
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
        const token = await user.createToken();
        res.status(201)
            .send({ user, token });
    }
    catch(e) {
        res.status(400)
            .send(e);
    }
});

//USER SIGNIN
router.post('/users/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(404)
                        .send("Data not found.");
        }
        
        const user = await User.findByCredentials(email, password);
        if(!user) {
            return res.status(404)
                        .send("User not found.");
        }
        const token = await user.createToken();
        res.status(200)
            .send({user, token});
    }
    catch(e) {
        res.status(400)
            .send(e);
    }
});

//USER LOGOUT SINGLE
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(tok => tok.token !== req.token);
        await req.user.save();

        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(500)
            .send("Unable to logout.");
    }
});

//USER LOGOUT ALL
router.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200)
            .send(req.user);
    }
    catch(e) {
        res.status(500)
            .send("Unable to logout from all accounts.");
    }
});

//USER UPDATE
router.patch('/users/update', auth, async (req, res) => {
    try{
        const allowUpdates = ['email','nick','password'];
        const updates = Object.keys(req.body);
        const updateIsValid = updates.every(update => {
            return allowUpdates.includes(update);
        });
        if(!updateIsValid) {
            return res.status(400)
                        .send("Invalid update key.");
        }
        updates.forEach(upt => {
            req.user[upt] = req.body[upt];
        })
        await req.user.save();
        res.status(200)
            .send(req.user);
    }
    catch(e) {
        res.status(500)
            .send("Unable to update user.");
    }
});

//USER GET
router.get('/users/me', auth, async (req, res) => {
    try{
        res.status(200)
            .send({user: req.user, token: req.token});
    }
    catch(e) {
        res.status(500)
            .send("Unable to show the user.");
    }
});

//USER DELETE
router.delete('/users/delete', auth, async (req, res) => {
    try{ 
        await Recipe.deleteMany({owner: req.user._id});
        await User.deleteOne({_id: req.user._id});
        res.status(200)
            .send("User deleted.");
    }
    catch(e) {
        res.status(500)
            .send("Unable to delete user.");
    }
})

module.exports = router;
const express = require('express');
const Recipe = require('../../models/recipes');
const router = new express.Router();

router.post('/recipes/create', auth, async (req, res) => {
    try{
        const recipe = new Recipe({
            ...req.body,
            owner: req.user._id
        });
        if(!recipe) {
            return res.status(404)
                        .send('Empty data was sent.');
        }
        await recipe.save();
        res.status(201)
            .status(recipe);
    }
    catch(e) {  
        res.status(400)
            .send('Recipe was not created.');
    }
})

module.exports = router;
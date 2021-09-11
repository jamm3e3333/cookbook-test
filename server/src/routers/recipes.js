const express = require('express');
const Recipe = require('../../models/recipes');
const User = require('../../models/users');
const auth = require('../../middleware/auth');
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
            .send(recipe);
    }
    catch(e) {  
        res.status(400)
            .send(e);
    }
});

router.get('/recipes/all', auth, async (req, res) => {
    try {
        const sort = {};

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1; 
        }

        const user = await User.findOne({_id: req.user._id}).populate({
            path: 'recipes',
            match: {},
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).exec();
        
        const recipes = user.recipes;
        if(!recipes || !user) {
            return res.status(404)
                        .status('No recipe found.');
        }


        res.status(200)
            .send(recipes);
    }
    catch(e) {
        res.status(400)
            .send({msg: e.message});
    }
});

router.get('/recipes/get/one', auth, async (req, res) => {
    try {
        const name = req.query.name;

        if(!name) {
            return res.status(404)
                        .send('No recipe was found.');
        }

        const user = await User.findOne({_id: req.user._id}).populate({
            path: 'recipes',
            match: {
                name: new RegExp(`.*${name}.*`, 'i')
            },
            options: {
                limit: 5
            }
        }).exec();

        const recipes = user.recipes

        if(!recipes || !recipes.length) {
            return res.status(404)
                        .send('No recipe found.');
        }

        res.status(200)
            .send(recipes);
    }
    catch(e) {
        res.status(400)
            .send(e);
    }
});

router.patch('/recipes/update/:id', auth, async (req, res) => {
    try {
        console.log(req.params.id);
        const recipe = await Recipe.findOne({_id: req.params.id});

        if(!recipe) {
            return res.status(400)
                        .send('Recipe for update not found.');
        }

        const isAllowed = ['name','description','ingredients'];
        const isAllowedIng = ['name','quantity','unit'];

        const updates = Object.keys(req.body);

        const isUpdate = updates.every(update => isAllowed.includes(update));

        if(!isUpdate) {
            return res.status(400)
                        .send('Unable to update.');
        }

        //BIG CHECK FOR KEYS IN UPDATE BODY
        if(updates.includes('ingredients')) {
            req.body.ingredients.forEach(ingredient => {
                const ingUpdates = Object.keys(ingredient);
                if(ingUpdates.length < 3) {
                    return res.status(400)
                                .send('Unable to update.');
                }
                const isIngUpdate = ingUpdates.every(ing => isAllowedIng.includes(ing));

                if(!isIngUpdate) {
                    return res.status(400)
                                .send('Unable to update');
                }
            });
        }

        updates.forEach(update => {
            recipe[update] = req.body[update];
        });

        await recipe.save();

        res.status(200)
            .send(recipe);
    }
    catch(e) {
        res.status(400)
            .send({msg: e.message});
    }
});

module.exports = router;
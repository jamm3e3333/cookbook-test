const express = require('express');
const Recipe = require('../../models/recipes');
const User = require('../../models/users');
const auth = require('../../middleware/auth');
const router = new express.Router();

//CREATE A RECIPE
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

//GET ALL THE RECIPES WITH SOME FILTER QUERIES
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


//GET ON RECIPE BY THE NAME
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


//UPDATE A RECIPE 
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


//DELETE ONE RECIPE
router.delete('/recipes/delete/one/:id', auth, async (req, res) => {
    try{
        const id = req.params.id;
        await Recipe.deleteOne({_id: id, owner: req.user._id});
        res.status(200)
            .send(`Recipe with id ${id} was deleted.`);
    }
    catch(e) {
        res.status(400)
            .send({msg: e.message});
    }
})

//DELETE ALL RECIPES
router.delete('/recipes/delete/all', auth, async (req, res) => {
    try{
        await Recipe.deleteMany({owner: req.user._id});
        res.status(200)
            .send(`Recipes from user ${req.user.nick} were deleted.`);
    }
    catch(e) {
        res.status(400)
            .send({msg: e.message});
    }
})

module.exports = router;
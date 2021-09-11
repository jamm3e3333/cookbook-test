const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500,
        lowercase: true,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxLength: 25,
            minLength: 3
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            max: 5000000000
        },
        unit: {
            type: String,
            minLength: 1,
            maxLength: 10
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
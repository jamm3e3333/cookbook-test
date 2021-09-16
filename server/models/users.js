const mongoose = require('mongoose');
const Recipe = require('./recipes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                throw new Error("Email is invalid.");
            }
        }
    },
    nick: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value){
            if(value.length < 4) {
                throw new Error("Nick must be longer than 4 characters.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain the word password.");
            }
            if(value.length < 7) {
                throw new Error("Password must be longer than 7 characters.");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('recipes', {
    ref: 'Recipe',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    try{
        const user = await User.findOne({email});
        
        if(!user || !user.password) {
            return undefined;
        }
    
        const isValid = await bcrypt.compare(password, user.password);
    
        if(!isValid) {
            return undefined;
        }
        return user;
    }
    catch(e) {
        throw new Error('Unable to login.');
    }
}

userSchema.methods.createToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    if(!token) {
        throw new Error("Token not created.");
    }
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
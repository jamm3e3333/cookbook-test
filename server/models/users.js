const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    }
}, {
    timestamps: true
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
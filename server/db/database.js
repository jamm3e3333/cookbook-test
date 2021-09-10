const mongoose = require('mongoose');

function connectDb() {
    mongoose.connect(`mongodb://jamm3e3333:ahoj123@mongo:27017/cookbook?authSource=admin`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to db');
    })
    .catch(e => {
        console.log('Unable to connect to db.' + e);
        setTimeout(() => connectDb(), 15000);
    });
}

connectDb();
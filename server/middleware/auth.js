const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try{
        const authToken = req.header('Authorization').replace('Bearer ','');
        const verification = jwt.verify(authToken, process.env.JWT_SECRET);
        
        const user = await User.findOne({_id: verification._id, 'tokens.token': authToken});
    
        if(!user) {
            return res.status(401)
                        .send("Unatuhorized");
        }
    
        req.user = user;
        req.token = authToken;
    
        next();
    }
    catch(e) {
        res.status(401)
            .send("Unauthorized.");
    }
}

module.exports = auth;
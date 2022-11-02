const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Users = mongoose.model('users');

const authMiddleware = async (req, res, next) => {
    //validate the authorization into the headers
    if (!('authorization' in req.headers) || !(req.headers.authorization) || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({
            "msg": "401: Bearer token is not specified."
        });
    }

    // QYqbUsdVGdifTzqh
    //decode the auth token 
    const decode = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET_KEY);

    //validate the decoded data
    if (!decode) {
        return res.status(403).json({
            "msg": "Forbidden"
        });
    }


    //validate the name and apiKey
    const user = await Users.findById(decode.id).lean();

    if (!user) {
        return res.status(403).json({
            "msg": "Forbidden"
        });
    }

    req.authName = user.name;

    next();
}

module.exports = authMiddleware;
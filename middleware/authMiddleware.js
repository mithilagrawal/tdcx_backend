const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config");
const { users } = require('../records/records');

const authMiddleware = async (req, res, next) => {
    //validate the authorization into the headers
    if (!('authorization' in req.headers) || !(req.headers.authorization) || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        return res.status(401).json({
            "msg": "401: Bearer token is not specified."
        });
    }

    //decode the auth token 
    const decode = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET_KEY);

    //validate the decoded data
    if (!decode || !(users.find(item => (item.name == decode?.name)))) {
        return res.status(403).json({
            "msg": "403: Forbidden"
        });
    }

    req.authName = decode.name;

    next();
}

module.exports = authMiddleware;
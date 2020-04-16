const jwt = require('jsonwebtoken');
const authConfig = require("../config/authConfig");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader)
        return res.status(401).send({ error: 'Não tem Token!' });

    const partsToken = authHeader.split(' ');

    if (!partsToken.lenght === 2)
        return res.status(401).send({ error: "Token error" });

    const [scheme, token] = partsToken;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token formato errado" });

    jwt.verify(token, authConfig(), (err, decoded) => {
        if (err)
            return res.status(401).send({ error: "Token Invalido!" });

        req.userId = decoded.id;
        
        return next();
    })


}
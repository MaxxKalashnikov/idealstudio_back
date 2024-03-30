const {sign, verify} = require('jsonwebtoken');
const SECRET_JWT_KEY = 'tisosalmeniaebali228';

const createToken = (userName) => {
    const accessToken = sign({userName: userName}, SECRET_JWT_KEY, {
        expiresIn: 10,
    });
    return accessToken;
}

const verifyToken = (req, res, next) =>{
    const access_token = req.cookies.access_token;

    if(!access_token){
        return res.status(401).json({message: "Access token not found"})
    }
    try{
        const validToken = verify(access_token, SECRET_JWT_KEY);
        if(validToken){
            req.authenticated = true;
            req.user = validToken;
            return next();
        }
    }
    catch(e){
        return res.status(403).json({message: "Invalid access token"})
    }
}

module.exports = {createToken, verifyToken};
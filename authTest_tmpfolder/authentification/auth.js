const {sign, verify} = require('jsonwebtoken');
const SECRET_JWT_KEY = 'tisosalmeniaebali228';
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();
const { db } = require('../db');
const SALT_ROUNDS = 10;



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


const registerUser = async (username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.none('INSERT INTO users(username, password_hash) VALUES($1, $2)', [username, hashedPassword]);
        return true; 
    } catch (error) {
        console.error("Error registering user:", error);
        return false; 
    }
};

const authenticateUser = async (username, password) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (passwordMatch) {
                return user; // Authentication successful
            }
        }
        return null; // User not found or incorrect password
    } catch (error) {
        console.error("Error authenticating user:", error);
        return null; // Error occurred during authentication
    }
};


// const login = async (req, res) => {
//     const { userName, password } = req.body;

//     try {
//         const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName]);
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const accessToken = createToken(userName);
//         res.cookie('access_token', accessToken, { httpOnly: true });
//         res.status(200).json({ message: 'Login successful', token: accessToken });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Login failed' });
//     }
// }


const login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [userName]);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = createToken(userName);
        res.cookie('access_token', accessToken, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
}
// this func is for testing access rights and checks that db rw is working 
const getUsers = async (req, res, next) => {
    try {
        const users = await db.any('SELECT * FROM users');
        req.users = users; // Attach users data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};


module.exports = { createToken, verifyToken, registerUser, authenticateUser, getUsers };
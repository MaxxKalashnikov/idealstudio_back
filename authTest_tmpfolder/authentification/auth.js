require('dotenv').config();
const {sign, verify} = require('jsonwebtoken');
const SECRET_JWT_KEY = 'tisosalmeniaebali228';
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();
const { query } = require('../../helpers/db');

const createToken = (userName, role) => {
    console.log("ROLEEE::::   ",role);
    const accessToken = sign({ userName: userName, role: role }, SECRET_JWT_KEY, {
        expiresIn: '1h',
    });
    return accessToken;
}

const verifyToken = (req, res, next) =>{

    const access_token = req.cookies.access_token;
    console.log("verification:::",req.cookies.access_token);
    if(!access_token){
        return res.status(401).json({message: "Access token not found"})
    }
    try{
        console.log("VERIFY::  ", access_token)
        const validToken = verify(access_token, SECRET_JWT_KEY);
        if(validToken){
            req.authenticated = true;
            req.user = validToken;
            console.log("THE TOKEN IS VALID")
            return next();
        }
        else{
            console.log("FUUUUCK")
        }
    }
    catch(e){
        return res.status(403).json({message: "Invalid access token"})
    }
}
const saltRounds = 10;

// const registerUser = async (username, password, user_type) => {
//     try {
//         const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
//         //ONLY WORKS FOR EMPLOYEE REGISTRASION!!!!!!!!
//         await query('INSERT INTO user_account(user_type, username, password) VALUES($1, $2, $3)', [user_type, username, hashedPassword]);
//         return true; 
//     } catch (error) {
//         console.error("Error registering user:", error);
//         return false; 
//     }
// };

const registerUser = async (username, password, user_type) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await query('INSERT INTO user_account(user_type, username, password) VALUES($1, $2, $3)', [user_type, username, hashedPassword]);
        return true; 
    } catch (error) {
        console.error("Error registering user:", error);
        return false; 
    }
};

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await authenticateUser(username, password);
        if (user) {
            const accessToken = createToken(username, user.rows[0].role); // Pass the user's role here
            res.cookie('access_token', accessToken, { httpOnly: true });
            res.status(200).json({ message: 'Login successful', token: accessToken });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Login failed' });
    }
}

const authenticateUser = async (username, password) => {
    try {
        const user = await query("SELECT * FROM users WHERE username = $1", [username]);
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.rows[0].hashed_password);//it took me 1 hour to fix this bug with rows[0]...
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

// this func is for testing access rights and checks that db rw is working 
const getUsers = async (req, res, next) => {
    try {
        // Check if user is authenticated and has a role
        console.log("req.authenticated:::::", req.authenticated);
        console.log("req.user:::::", req.user);
        console.log("req.user.ROLE:::",req.user.role);
        if (req.authenticated && req.user && req.user.role === 'admin') {
            console.log("TRYING TO READ DB")
            const users = await query('SELECT * FROM users');
            req.users = users; // Attach users data to the request object
            next(); // Proceed to the next middleware or route handler
        } else {
            // If user is not authenticated or doesn't have admin role, send forbidden error
            res.status(403).json({ message: 'Access forbidden: Only admin can access this resource' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};



module.exports = { createToken, verifyToken, registerUser, authenticateUser, getUsers, login };
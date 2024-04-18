require('dotenv').config();
const path = require('path');
const { query } = require('../helpers/db.js')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUserRole, authenticateUser, login, isAdmin}= require('./authentification/auth.js')
const cookieParser = require('cookie-parser');
const usersRouter = express.Router()
usersRouter.use(cookieParser());
usersRouter.use(bodyParser.urlencoded({ extended: true }));
usersRouter.use(bodyParser.json());
// usersRouter.use(cors())

//for testing
usersRouter.get('/test' , async (req, res)=>{
    try {
        console.log(process.env.DB_PASSWORD)
        const result = await query('SELECT * FROM user_account');
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
})

// register new user
usersRouter.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = "customer";
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const success = await registerUser(username, password, user_type);
    if (success) {
        res.status(201).json({ message: "User registered successfully" });
    } else {
        res.status(500).json({ message: "Failed to register user" });
    }
});


// authentication
usersRouter.post('/login', login);  

usersRouter.get('/profile', verifyToken, async (req, res) => {
    return res.status(200).json({ 
        role: req.user.role,
        id: req.user.user_account_id,
        username: req.user.userName
     });
});



module.exports = { usersRouter }
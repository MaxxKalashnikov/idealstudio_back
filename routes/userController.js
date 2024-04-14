require('dotenv').config();
const { query } = require('../helpers/db.js')
const express = require('express');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUsers, authenticateUser, login, getCust}= require('./authentification/auth.js')
const app = express();
const cookieParser = require('cookie-parser');
const usersRouter = express.Router()
usersRouter.use(cookieParser());
usersRouter.use(bodyParser.urlencoded({ extended: true }));
usersRouter.use(bodyParser.json());

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

// usersRouter.post('/registeremployee', async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const user_type = "employee";
//     if (!username || !password) {
//         return res.status(400).json({ message: "Username and password are required" });
//     }
//     const success = await registerUser(username, password, user_type);
//     if (success) {
//         res.status(201).json({ message: "User registered successfully" });
//     } else {
//         res.status(500).json({ message: "Failed to register user" });
//     }
// });

// authentication
usersRouter.post('/login', login);

usersRouter.get('/users', verifyToken, getUsers, (req, res) => {
    // Access the users data attached to the request object
    const users = req.users;
    res.json(users);
});


module.exports = { usersRouter }
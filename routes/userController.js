const express = require('express');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUsers, authenticateUser} = require('../authTest_tmpfolder/authentification/auth')
const app = express();
const cookieParser = require('cookie-parser');
const usersRouter = express.Router()
usersRouter.use(cookieParser());
usersRouter.use(bodyParser.urlencoded({ extended: true }));
usersRouter.use(bodyParser.json());

// register new user
usersRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const success = await registerUser(username, password);
    if (success) {
        res.status(201).json({ message: "User registered successfully" });
    } else {
        res.status(500).json({ message: "Failed to register user" });
    }
});

// authentication
usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await authenticateUser(username, password);
        if (user) {
            console.log('User defined')
            const accessToken = createToken(username);
            res.cookie('access_token', accessToken, { httpOnly: true });
            res.status(200).json({ message: 'Login successful', token: accessToken });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

module.exports = { usersRouter }
require('dotenv').config();
const path = require('path');
const { query } = require('../helpers/db.js')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUsers, authenticateUser, login, getCust}= require('./authentification/auth.js')
const cookieParser = require('cookie-parser');
const usersRouter = express.Router()
usersRouter.use(cookieParser());
usersRouter.use(bodyParser.urlencoded({ extended: true }));
usersRouter.use(bodyParser.json());
usersRouter.use(cors())

usersRouter.use(cors({
    origin: 'http://127.0.0.1:5501',
    credentials: true
  }));

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
    // Здесь можно продолжить выполнение кода для обработки запроса, если токен прошел верификацию
    return res.status(200).json({ message: "Hello profile!" });
});

// usersRouter.get('/profile',verifyToken, getUsers, async (req, res) => {
//     res.status(201).json({ message: "ОК" });
//     // const filePath = path.resolve(__dirname, pathToProfile);
//     // // Отправка файла в качестве ответа
//     // res.sendFile(filePath);
// });



module.exports = { usersRouter }
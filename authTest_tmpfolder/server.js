require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUsers, authenticateUser, login, getCust} = require('./authentification/auth')
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = 3001;
const { query } = require('../helpers/db.js');

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.get('/test' , async (req, res)=>{
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

//This is for testing access right
app.get('/users', verifyToken, getUsers, (req, res) => {
    // Access the users data attached to the request object
    const users = req.users;
    res.json(users);
});


app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;
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

app.post('/login', login)

// app.get('/login', (req, res)=>{
//     res.sendFile(__dirname + "/public/login.html")
// })

app.get('/profile', verifyToken, async(req, res)=>{
    return res.status(200).json({message: "Hello profile!"})
})


app.listen(PORT, () =>{
    console.log('Server is running on port ' + PORT)
})
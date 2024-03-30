const express = require('express');
const bodyParser = require('body-parser');
const {createToken, verifyToken, registerUser, getUsers, authenticateUser} = require('./authentification/auth')
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = 3001;


app.get('/', (req, res) => {
    res.send('Hello world!')
})

//This is for testing access right
app.get('/users', getUsers, (req, res) => {
    // Access the users data attached to the request object
    const users = req.users;
    res.json(users);
});

app.post('/register', async (req, res) => {
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


app.post('/login', async (req, res) => {
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

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + "/public/login.html")
})

app.get('/profile', verifyToken, async(req, res)=>{
    return res.status(200).json({message: "Hello profile!"})
})




app.listen(PORT, () =>{
    console.log('Server is running on port ' + PORT)
})
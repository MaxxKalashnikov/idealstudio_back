const express = require('express');
const bodyParser = require('body-parser');
const {createToken, verifyToken} = require('./authentification/auth')
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = 3001;


app.get('/', (req, res) => {
    res.send('Hello world!')
})


app.post('/login', (req, res) => {
    const { userName, password } = req.body;
    console.log(`${userName} is trying to login`);

    if(userName === "max" && password === "1234"){
        const token = createToken(userName);
        res.cookie("access_token", token, {httpOnly: true,})
        return res.json({message: "Login successful!", token: token})
    }
    else{
        return res.status(401).json({message: "YOU SHALL NOT PASS!!!"})
    }
})

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + "/public/login.html")
})

app.get('/profile', verifyToken, async(req, res)=>{
    return res.status(200).json({message: "Hello profile!"})
})

app.listen(PORT, () =>{
    console.log('Server is running on port ' + PORT)
})
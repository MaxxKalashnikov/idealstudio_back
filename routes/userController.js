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
    const success = await registerUser(username, password, "customer");
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



// add new customer
// customersRouter.post('/new', async (req, res) => {
//     try {
//         const user_account_id = req.body.user_account_id
//         const firstname = req.body.firstname
//         const lastname = req.body.lastname
//         const email = req.body.email
//         const phone = req.body.phone
        
//         const result = await query('insert into customer(user_account_id, firstname, lastname, email, phone) values ($1, $2, $3, $4, $5) returning *',
//         [user_account_id, firstname, lastname, email, phone])

//         const rows = result.rows ? result.rows : []
//         res.status(200).json(rows)
//     } catch (error) {
//         console.log(error)
//         res.statusMessage = error
//         res.status(500).json({error: error})
//    }
// })



// customersRouter.put('/update/:user_id', async (req, res) => {
//     try {
//         const customer_id = req.params.customer_id
//         const user_account_id = req.body.user_account_id
//         const firstname = req.body.firstname
//         const lastname = req.body.lastname
//         const email = req.body.email
//         const phone = req.body.phone

//         const result = await query('update user set user_account_id=($1), firstname=($2), lastname=($3), email=($4), phone=($5) where customer_id=($6) returning *',
//         [user_account_id, firstname, lastname, email, phone, customer_id])

//         const rows = result.rows ? result.rows : []
//         res.status(200).json(rows)
//     } catch (error) {
//         console.log(error)
//         res.statusMessage = error
//         res.status(500).json({error: error})
//     }
// })

module.exports = { usersRouter }
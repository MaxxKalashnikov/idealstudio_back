require('dotenv').config();
const {sign, verify} = require('jsonwebtoken');
const SECRET_JWT_KEY = 'tisosalmeniaebali228';
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();
const { query } = require('../../helpers/db.js');
const crypto = require('crypto');

const createToken = (userName, role, uid) => {
    console.log("ROLEEE::::   ",role);
    const accessToken = sign({ userName: userName, role: role, user_account_id: uid}, SECRET_JWT_KEY, {
        expiresIn: '1h',
    });
    return accessToken;
}

const verifyToken = async (req, res, next) =>{

    const authHeader = req.headers['authorization'];
    let access_token = authHeader && authHeader.split(' ')[1];
    access_token = access_token.slice(1, -1);
    console.log("verification:::", access_token);
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
            console.log(req.user)
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


const SALT_ROUNDS = 7
const registerUser = async (username, password, user_type) => {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        console.log(hashedPassword)
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
        let accessToken = ''
        if (user) {
            accessToken = createToken(username, user.rows[0].user_type, user.rows[0].user_account_id);
             // Pass the user's role here
            // res.cookie('access_token', accessToken, { httpOnly: true });
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
        console.log(username)
        const user = await query("select * from user_account where username = $1", [username]);
        let employeeUserType = ''
        if(user.rows[0].user_type === 'employee'){
            employeeUserType = await query("SELECT e.employee_type FROM employee e LEFT JOIN user_account u ON e.user_account_id = u.user_account_id WHERE u.username = $1", [username])
            console.log(employeeUserType.rows[0].employee_type)
            user.rows[0].user_type = employeeUserType.rows[0].employee_type
        }
        // console.log(user)
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.rows[0].password);//it took me 1 hour to fix this bug with rows[0]...
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
const getUserRole = (req, res, next) => {
    try {
        // Check if user is authenticated and has a role
        console.log("req.authenticated:::::", req.authenticated);
        console.log("req.user:::::", req.user);
        console.log("req.user.ROLE:::",req.user.role);

        return req.user.role
        // if (req.authenticated && req.user && req.user.role === 'admin') {
        //     switch(req.user.role){
        //         case "admin":
        //             return req.user.role
        //     }
        //     console.log("TRYING TO READ DB")
            // const users = await query('SELECT * FROM user_account');
            // req.users = users; // Attach users data to the request object
        //     next(); // Proceed to the next middleware or route handler
        // } else {
        //     // If user is not authenticated or doesn't have admin role, send forbidden error
        //     return res.status(403).json({ message: 'Access forbidden: Only admin can access this resource' });
        // }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const isAdmin = (req, res, next)=>{
    try {
        // Check if user is authenticated and has a role
        console.log("req.authenticated:::::", req.authenticated);
        console.log("req.user:::::", req.user);
        console.log("req.user.ROLE:::",req.user.role);
        if (req.authenticated && req.user && req.user.role === 'admin') {
            return res.status(200).json({ message: "hello admin" });
        } else {
            // If user is not authenticated or doesn't have admin role, send forbidden error
            // return res.status(403).json({ message: 'Access forbidden: Only admin can access this resource' });
            next()
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
}

const isCustomer = (req, res, next)=>{
    try {
        // Check if user is authenticated and has a role
        console.log("req.authenticated:::::", req.authenticated);
        console.log("req.user:::::", req.user);
        console.log("req.user.ROLE:::",req.user.role);
        if (req.authenticated && req.user && req.user.role === 'customer') {
            return res.status(200).json({ message: "hello customer" });
        } else {
            // If user is not authenticated or doesn't have admin role, send forbidden error
            // return res.status(403).json({ message: 'Access forbidden: Only admin can access this resource' });
            next()
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
}

const isEmployee = (req, res, next)=>{
    try {
        // Check if user is authenticated and has a role
        console.log("req.authenticated:::::", req.authenticated);
        console.log("req.user:::::", req.user);
        console.log("req.user.ROLE:::",req.user.role);
        if (req.authenticated && req.user && req.user.role === 'employee') {
            return res.status(200).json({ message: "hello employee" });
        } else {
            // If user is not authenticated or doesn't have admin role, send forbidden error
            // return res.status(403).json({ message: 'Access forbidden: Only admin can access this resource' });
            next()
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
}

const forgotPassword = async (req, res, next)=>{
    try {
        //1. based on email or username we get user
        let email = req.body.email;
        let username = req.body.username;
        let resetToken = ''
        if (email) {
            const isUser = await query('SELECT username FROM user_account JOIN customer c ON user_account.user_account_id = c.user_account_id WHERE c.email = $1;', [email]);
            if (isUser.rows.length > 0) {
                username = isUser.rows[0].username;
                resetToken = await createResetToken(username)
                console.log(resetToken)
                res.status(200).json({resetToken: resetToken, email: email})
            } else {
                res.status(203).json({ message: 'There is no user with such email!' });
            }
        } else if (username) {
            // case if there is username
            const isUser = await query('select email from customer JOIN user_account u ON customer.user_account_id = u.user_account_id WHERE u.username = $1;', [username]);
            if (isUser.rows.length > 0) {
                email = isUser.rows[0].email;
                resetToken = await createResetToken(username);
                console.log(resetToken)
                res.status(200).json({resetToken: resetToken, email: email})
            } else {
                res.status(203).json({ message: 'There is no user with such username!' });
            }
        } 
    } catch (error) {
        console.error('Error:', error);
    }
    
}

const resetPassword = (req, res, next)=>{

}

const createResetToken = async(username)=>{
    const resetToken = crypto.randomBytes(32).toString('hex');
    const encryptedRT = crypto.createHash('sha256').update(resetToken).digest('hex');
    const currentDate = new Date();
    console.log("plain token: "+resetToken)
    console.log(encryptedRT)

    const futureDate = new Date(currentDate.getTime() + 10 * 60 * 1000);

    const dateString = futureDate.toLocaleString('en-FI', { timeZone: 'Europe/Helsinki' }).replace(',', '');

    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    let [hours, minutes, seconds] = timePart.split('.');
    // hours = Number(hours) + 3;
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`;

    console.log(formattedDate)
    const un = await query("UPDATE user_account SET reset_token = $1, token_expires = $2 WHERE username = $3 returning token_expires;", [encryptedRT, formattedDate, username])
    if(un.rows.length > 0){
        return resetToken
    }
    else{
        console.log('Some error occured, try again later')
    }
}

module.exports = { forgotPassword, isAdmin, createToken, verifyToken, registerUser, authenticateUser, getUserRole, login };
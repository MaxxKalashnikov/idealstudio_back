const express = require('express')
const bcrypt = require('bcrypt');
const { query } = require('../helpers/db.js')
const customersRouter = express.Router()

// get all customers
customersRouter.get('/', async (req, res) => {
    try {
        const result = await query('select * from customer')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

customersRouter.get('/profile/:user_id', async (req, res) => {
    try {
        const result = await query('select firstname, lastname, email, phone from customer where user_account_id = $1', 
        [req.params.user_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        const responseData = {
            personalInfo: rows,
        };
        res.status(200).json(responseData)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// get customer by id
customersRouter.get('/:customer_id', async (req, res) => {
    try {
        const result = await query('select * from customer where customer_id=($1)', 
        [req.params.customer_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// add new customer
customersRouter.post('/new', async (req, res) => {
    try {
        const user_account_id = req.body.user_account_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone
        
        const result = await query('insert into customer(user_account_id, firstname, lastname, email, phone) values ($1, $2, $3, $4, $5) returning *',
        [user_account_id, firstname, lastname, email, phone])

        const rows = result.rows ? result.rows : []
        console.log(rows)
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})
// add new customer account
customersRouter.post('/account/new', async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone

        const hashedPassword = await bcrypt.hash(password, 10);
        

        const result = await query('SELECT create_user_and_customer($1, $2, $3, $4, $5, $6)',
        [username, hashedPassword, firstname, lastname, email, phone])

        const rows = result.rows ? result.rows : []
        console.log(rows)
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})


// update a customer
customersRouter.put('/update/:customer_id', async (req, res) => {
    try {
        console.log("EMPLOYEE::: ", req )
        const customer_id = req.params.customer_id
        const user_account_id = req.body.user_account_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone

        const result = await query('update customer set user_account_id=($1), firstname=($2), lastname=($3), email=($4), phone=($5) where customer_id=($6) returning *',
        [user_account_id, firstname, lastname, email, phone, customer_id])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// delete a customer
customersRouter.delete('/delete/:customer_id', async (req, res) => {
    try {
        const result = await query('delete from customer where customer_id=($1)', 
        [req.params.customer_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json({customer_id: req.params.customer_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


module.exports= { customersRouter }
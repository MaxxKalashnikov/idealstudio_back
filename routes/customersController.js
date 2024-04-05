const express = require('express')
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
        const customer_id = req.params.customer_id
        const user_account_id = req.body.user_account_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone

        const result = await query('update customer set user_account_id=($1), firstname=($2), lastname=($3), email=($4), phone=($5) where customer_id=($6) returning *',
        [user_account_id, firstname, lastname, email, phone, customer_id])

        res.status(200).json(result.rows)
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
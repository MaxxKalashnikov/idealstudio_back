const express = require('express')
const { query } = require('../helpers/db.js')
const customersRouter = express.Router()

// get all customers
customersRouter.get('/', async (req, res) => {
    try {
        const result = await query('select * from customers')
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
        const result = await query('select * from customers where customer_id=($1)', 
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

// delete a customer
customersRouter.delete('/delete/:customer_id', async (req, res) => {
    try {
        const result = await query('delete from customers where customer_id=($1)', 
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
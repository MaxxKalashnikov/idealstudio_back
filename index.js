// use environment variables
require('dotenv').config()
//console.log(process.env)
const express = require('express')
const cors = require('cors')


// app
const app = express()
app.use(cors())
app.use(express.json())
// define that express can read parameters from url address
app.use(express.urlencoded({extended: false}))



// You should add your routers here.
// timeslots
const { timeslotsRouter } = require('./routes/timeslotsController.js')
app.use('/timeslots', timeslotsRouter)

// customers
const { customersRouter } = require('./routes/customersController.js')
app.use('/customers', customersRouter)

// employees
const { employeesRouter } = require('./routes/employeesController.js')
app.use('/employees', employeesRouter)


const port = process.env.PORT 
app.listen(port)
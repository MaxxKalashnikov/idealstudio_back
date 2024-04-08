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

// appointments
const { appointmentsRouter } = require('./routes/appointmentsController.js');
app.use('/appointments', appointmentsRouter)

// users
const { usersRouter } = require('./routes/userController.js')
app.use('/users', usersRouter)

// home
const { homeRouter } = require('./routes/homeController.js')
app.use('/home', homeRouter)

// customers
const { customersRouter } = require('./routes/customersController.js')
app.use('/customers', customersRouter)

// employees
const { employeesRouter } = require('./routes/employeesController.js')
app.use('/employees', employeesRouter)

// blog
const { blogsRouter } = require('./routes/blogsController.js')
app.use('/blogs', blogsRouter)


// masters 
const { mastersRouter } = require('./routes/mastersController.js')
app.use('/masters', mastersRouter)


// services
const { servicesRouter } = require('./routes/servicesController.js')
app.use('/services', servicesRouter)
const port = process.env.PORT 


app.listen(port)
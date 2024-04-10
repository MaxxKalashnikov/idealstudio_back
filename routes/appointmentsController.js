const express = require('express')
const { query } = require('../helpers/db.js')
const appointmentsRouter = express.Router()

// get details of available appointments
appointmentsRouter.get('/all', async (req, res) => {
    try {
        const result = await query('SELECT * FROM get_appointment_details();')
        const rows = result.rows ? result.rows : [] 
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

//get details for certain master, depeneds on username
appointmentsRouter.get('/my/:username', async (req, res) => {
    try {
        const result = await query('SELECT * FROM get_appointment_details_by_username($1);', [req.params.username])
        const rows = result.rows ? result.rows : [] 
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

//get more details for appointment
appointmentsRouter.get('/more/:appointment_id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM get_appointment_details_by_id($1);', [req.params.appointment_id])
        const rows = result.rows ? result.rows : [] 
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

//updates status of an appointment (is_canceled field)
appointmentsRouter.put('/update/:appointment_id', async (req, res) => {
    try {
        const result = await query('update appointment set is_canceled=($1) where appointment_id=($2)',
        [req.body.is_canceled, req.params.appointment_id])

        res.status(200).json({appointment_id: req.params.appointment_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

appointmentsRouter.post('/new', async (req, res) => {
    try {
        const employee_id = req.body.employee_id
        const duration = req.body.duration
        const start_time = req.body.start_time
        const end_time = req.body.end_time
        const start_date = req.body.start_date
        const end_date = req.body.end_date

        const result = await query('select generate_timeslots($1, $2, $3, $4, $5, $6)',
        [employee_id, duration, start_time, end_time, start_date, end_date])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})

module.exports = { appointmentsRouter }
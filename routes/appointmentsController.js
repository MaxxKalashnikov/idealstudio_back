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


module.exports = { appointmentsRouter }
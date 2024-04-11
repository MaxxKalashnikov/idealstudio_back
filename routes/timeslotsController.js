const express = require('express')
const { query } = require('../helpers/db.js')
const timeslotsRouter = express.Router()

// get all available timeslots
timeslotsRouter.get('/', async (req, res) => {
    try {
        const result = await query('select * from timeslot')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

timeslotsRouter.get('/time/:employee_id', async (req, res) => {
    try {
        const employeeId = req.params.employee_id;
        const result = await query('SELECT * FROM timeslot WHERE employee_id = $1', [employeeId])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// get the last timesslot of each employee
timeslotsRouter.get('/last', async (req, res) => {
    try {
        const result = await query('select * from get_last_timeslot_date_per_employee()')
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


// add new timeslots
timeslotsRouter.post('/new', async (req, res) => {
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

// update is_available field of a timeslot
timeslotsRouter.put('/update/:timeslot_id', async (req, res) => {
    try {
        const result = await query('update timeslot set is_available=($1) where timeslot_id=($2)',
        [req.body.is_available, req.params.timeslot_id])

        res.status(200).json({timeslot_id: req.params.timeslot_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


module.exports= { timeslotsRouter }
const express = require('express')
const { query } = require('../helpers/db.js')
const homeRouter = express.Router()

// gets full name email and phone for profile details, gives an option for using custom data
homeRouter.get('/:employee_id?', async (req, res) => {
    try {
        //data for personal info div
        const result1 = await query('SELECT firstname, lastname, email, phone FROM employee where employee_id = $1;', [1])
        const rows1 = result1.rows ? result1.rows : []
        //data for statistics
        const result2 = await query('select * from get_statistics();')
        const rows2 = result2.rows ? result2.rows : []

        const responseData = {
            personalInfo: rows1,
            statistics: rows2
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// updates personal info, also will work for other types of user
homeRouter.put('/update/:id_worker?', async (req, res) => {
    try {
        const result = await query("SELECT update_employee($1, $2, $3, $4, $5)", [req.body.firstname,
            req.body.lastname, req.body.email, req.body.phone, 1])

        res.status(200).json({"message": "success"})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})




module.exports= { homeRouter }
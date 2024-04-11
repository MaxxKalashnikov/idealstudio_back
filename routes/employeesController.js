const express = require('express')
const { query } = require('../helpers/db.js')
const employeesRouter = express.Router()
const bcrypt = require('bcrypt');

// get all employeesSALT_ROUNDS
employeesRouter.get('/', async (req, res) => {
    try {
        const result = await query('select * from employee')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = erroSALT_ROUNDSr
        res.status(500).json({error: error})
    }
})

employeesRouter.get('/more', async (req, res) => {
    try {
        const result = await query('SELECT employee.*, user_account.profile_picture_url FROM employee JOIN user_account ON employee.user_account_id = user_account.user_account_id;')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// get employee by id
employeesRouter.get('/:employee_id', async (req, res) => {
    try {
        const result = await query('select * from employee where employee_id=($1)', 
        [req.params.employee_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

//register new employee
employeesRouter.post('/new', async (req, res) => {
    try {
        const username = req.body.username; 
        const password = req.body.password; 
        const user_type = 'employee'; // Assuming the user being registered is always an employee
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const employee_type = req.body.employee_type;
        const specialization = req.body.specialization;

        // Start a transaction
        await query('BEGIN');

        // Register the user (employee) in the user_account table
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const userAccountResult = await query('INSERT INTO user_account(user_type, username, password) VALUES($1, $2, $3) RETURNING user_account_id', [user_type, username, hashedPassword]);
        const user_account_id = userAccountResult.rows[0].user_account_id;

        // Register the employee in the employee table
        const employeeResult = await query('INSERT INTO employee(user_account_id, firstname, lastname, email, phone, employee_type, specialization) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_account_id, firstname, lastname, email, phone, employee_type, specialization]);

        // Commit the transaction
        await query('COMMIT');

        // Send response with the newly created employee data
        const employee = employeeResult.rows[0];
        res.status(200).json(employee);
    } catch (error) {
        // Rollback the transaction if an error occurs
        await query('ROLLBACK');
        console.error("Error registering employee:", error);
        res.status(500).json({ error: "Error registering employee." });
    }
});



// update an employee
employeesRouter.put('/update/:employee_id', async (req, res) => {
    try {
        const employee_id = req.params.employee_id
        const user_account_id = req.body.user_account_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone
        const employee_type = req.body.employee_type
        const specialization = req.body.specialization
        const is_active = req.body.is_active

        const result = await query('update employee set user_account_id=($1), firstname=($2), lastname=($3), email=($4), phone=($5), employee_type=($6), specialization=($7), is_active=($8) where employee_id=($9) returning *',
        [user_account_id, firstname, lastname, email, phone, employee_type, specialization, is_active, employee_id])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// delete a customer
employeesRouter.delete('/delete/:employee_id', async (req, res) => {
    try {
        const result = await query('delete from employee where employee_id=($1)', 
        [req.params.employee_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json({employee_id: req.params.employee_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


module.exports= { employeesRouter }
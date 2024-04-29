const express = require('express')
const { query } = require('../helpers/db.js')
const employeesRouter = express.Router()
const bcrypt = require('bcrypt');

// Function to hash password
const hashPassword = async (password) => {
    const SALT_ROUNDS = 10; // Adjust the number of salt rounds as needed
    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
};
// get all employees
employeesRouter.get('/', async (req, res) => {
    try {
        const result = await query('select * from employee')
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

// add new employee
employeesRouter.post('/new', async (req, res) => {
    try {
        console.log("EMPLOYEE::: ", req.body )
        const username = req.body.username
        const password = req.body.password
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone
        //const employee_type = req.body.employee_type
        const specialization = req.body.specialization
        const picture = req.body.profile_picture_url
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert the user and employee
        const result = await query('SELECT create_user_and_employee($1, $2, $3, $4, $5, $6, $7, $8);',
        [username, hashedPassword, firstname, lastname, email, phone, picture, specialization])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows[0])
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})


// update an employee
employeesRouter.put('/update/:employee_id', async (req, res) => {
    try {
        const employee_id = req.params.employee_id
        const user_account_id = req.body.user_account_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const phone = req.body.phone
        //const employee_type = req.body.employee_type
        const specialization = req.body.specialization
        const is_active = req.body.is_active

        const result = await query('update employee set user_account_id=($1), firstname=($2), lastname=($3), email=($4), phone=($5), specialization=($6), is_active=($7) where employee_id=($8) returning *',
        [user_account_id, firstname, lastname, email, phone, specialization, is_active, employee_id])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// delete an employee
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

employeesRouter.get('/get/more', async(req, res)=>{
    try{
        const result = await query('SELECT employee.*, user_account.user_type, user_account.profile_picture_url FROM employee INNER JOIN user_account ON employee.user_account_id = user_account.user_account_id;')
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    }catch(err){
        res.status(203).json({error: err})
    }
})

module.exports= { employeesRouter }
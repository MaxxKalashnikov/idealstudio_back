const express = require('express');
const { query } = require('../helpers/db.js');
const mastersRouter = express.Router();

// get all
mastersRouter.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM masters');
        const masters = result.rows ? result.rows : [];
        res.status(200).json(masters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// get with id
mastersRouter.get('/:master_id', async (req, res) => {
    try {
        const { master_id } = req.params;
        const result = await query('SELECT * FROM masters WHERE id = $1', [master_id]);
        const master = result.rows[0];
        if (!master) {
            return res.status(404).json({ error: 'Master not found' });
        }
        res.status(200).json(master);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// add new
mastersRouter.post('/new', async (req, res) => {
    try {
        const { user_account_id, first_name, last_name, email, phone, specialization, employee_type, status } = req.body;
        const result = await query('INSERT INTO masters(user_account_id, first_name, last_name, email, phone, specialization, employee_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [user_account_id, first_name, last_name, email, phone, specialization, employee_type, status]);
        const newMaster = result.rows[0];
        res.status(200).json(newMaster);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// upd master info
mastersRouter.put('/update/:master_id', async (req, res) => {
    try {
        const { master_id } = req.params;
        const { user_account_id, first_name, last_name, email, phone, specialization, employee_type, status } = req.body;
        const result = await query('UPDATE masters SET user_account_id=$1, first_name=$2, last_name=$3, email=$4, phone=$5, specialization=$6, employee_type=$7, status=$8 WHERE id=$9 RETURNING *',
            [user_account_id, first_name, last_name, email, phone, specialization, employee_type, status, master_id]);
        const updatedMaster = result.rows[0];
        res.status(200).json(updatedMaster);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Delete master
mastersRouter.delete('/delete/:master_id', async (req, res) => {
    try {
        const { master_id } = req.params;
        const result = await query('DELETE FROM masters WHERE id=$1 RETURNING *', [master_id]);
        const deletedMaster = result.rows[0];
        res.status(200).json(deletedMaster);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { mastersRouter };
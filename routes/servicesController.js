const express = require('express');
const { query } = require('../helpers/db.js');
const servicesRouter = express.Router();

// Services get
servicesRouter.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM services');
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

// Obtaining information about a specific service by its identifier
servicesRouter.get('/:service_id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM services WHERE service_id = $1', [req.params.service_id]);
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

// Adding a new service
servicesRouter.post('/new', async (req, res) => {
    try {
        // Extracting data from the request body
        const { service_name, service_description, service_price } = req.body;

        // Running a database query to insert a new service
        const result = await query('INSERT INTO services (service_name, service_description, service_price) VALUES ($1, $2, $3) RETURNING *', 
                                    [service_name, service_description, service_price]);

        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});


// Updating information about the service
servicesRouter.put('/update/:service_id', async (req, res) => {
    try {
        // Extracting data from the request body
        const { serviceName, serviceDescription, servicePrice } = req.body;

        // Running a database query to update service information
        const result = await query('UPDATE services SET service_name = $1, service_description = $2, service_price = $3 WHERE service_id = $4 RETURNING *', 
                                    [serviceName, serviceDescription, servicePrice, req.params.service_id]);

        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

// Removing a service
servicesRouter.delete('/delete/:service_id', async (req, res) => {
    try {
        const serviceId = parseInt(req.params.service_id);

        await query('DELETE FROM services WHERE service_id = $1', [serviceId]);
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.log(error);
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});


module.exports = { servicesRouter };

require('dotenv').config();
const pgp = require('pg-promise')();

// Database connection parameters
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'booking',
    user: 'postgres',
    password: 't12t34t56t78t90'
};
1
// Creating a new database instance
const db = pgp(dbConfig);

module.exports = { db };

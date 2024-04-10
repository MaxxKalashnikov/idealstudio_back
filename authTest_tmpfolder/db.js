require('dotenv').config();
const pgp = require('pg-promise')();

// Database connection parameters
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'peteshko',
    user: 'postgres',
    password: '1234'
};
1
// Creating a new database instance
const db = pgp(dbConfig);

module.exports = { db };

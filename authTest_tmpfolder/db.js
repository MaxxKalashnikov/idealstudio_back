const pgp = require('pg-promise')();

// Database connection parameters
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'test1',
    user: 'postgres',
    password: '1234'
};

// Creating a new database instance
const db = pgp(dbConfig);

module.exports = { db };

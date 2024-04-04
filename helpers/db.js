// load environment variables from the .env file into process.env
require('dotenv').config()
const { Pool } = require('pg')


// values = [] assigns a default value to values
const query = (sql, values = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = openDb()
            // query result
            const result = await pool.query(sql, values)
            resolve(result)
        } catch(error) {
            reject(error.message)
        }
    })
}

// connect to db
const openDb = () => {
    const pool = new Pool ({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return pool
}

module.exports = {
    query
}
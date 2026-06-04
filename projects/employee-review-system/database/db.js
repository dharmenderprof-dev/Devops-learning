const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'employeeportal',
    password: 'Admin123!',
    port: 5432,
});

module.exports = pool;

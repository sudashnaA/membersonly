const { Pool } = require("pg");

require('dotenv').config();

const pool = new Pool({
    host: "localhost", // or wherever the db is hosted
    user: process.env.user,
    database: process.env.database,
    password: process.env.password,
    port: 5432 // The default port
});

// Expose the connection
module.exports = pool;

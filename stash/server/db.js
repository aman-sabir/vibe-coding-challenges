const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST, // '127.0.0.1' for local
    port: process.env.DB_PORT || 5432,
};

// Adjust config if using Cloud SQL Socket (common in production/GCP)
if (process.env.INSTANCE_CONNECTION_NAME) {
    dbConfig.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
    delete dbConfig.port; // Socket doesn't use port
}

const pool = new Pool(dbConfig);

module.exports = {
    query: (text, params) => pool.query(text, params),
};

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

// Connect to default 'postgres' db to create new db
const setupDb = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await client.connect();

        // Check if db exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'my_diary'");
        if (res.rowCount === 0) {
            console.log("Creating database 'my_diary'...");
            await client.query('CREATE DATABASE my_diary');
        } else {
            console.log("Database 'my_diary' already exists.");
        }
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await client.end();
        applySchema();
    }
};

const applySchema = async () => {
    const { Pool } = require('pg');
    const pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'my_diary'
    });

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log("Applying schema...");
        await pool.query(schemaSql);
        console.log("Schema applied successfully!");
    } catch (err) {
        console.error("Error applying schema:", err);
    } finally {
        await pool.end();
    }
};

setupDb();

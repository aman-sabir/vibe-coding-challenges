const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Re-initializing database from scratch...');
        await db.query(schemaSql);
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

initDb();

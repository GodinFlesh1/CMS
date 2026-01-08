require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const runMigration = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'cms_database',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'schema.sql');
    const seedFilePath = path.join(__dirname, 'seed.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    const seed = fs.readFileSync(seedFilePath, 'utf8');

    await client.query(sql);
    console.log('Migration completed successfully!');
    await client.query(seed);
    console.log('Seed data inserted successfully!');
    console.log('All tables created/updated');

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

runMigration();